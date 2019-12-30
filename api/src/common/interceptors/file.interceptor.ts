// tslint:disable:max-classes-per-file
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import * as fs from 'fs-extra';
import { extension } from 'mime-types';
import { normalize } from 'path';
import * as pump from 'pump';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

const LOG_CONTEXT = 'FileInterceptor';

export interface File {
  encoding?: string;
  fieldname?: string;
  filename?: string;
  filesize?: number;
  mimetype?: string;
  originalname?: string;
  tempfile?: string;
  uuid?: string;
}

interface Request extends FastifyRequest {
  file?: File;
}

interface Options {
  uploadDir: string;
}

const defaultOptions: Options = {
  uploadDir: './upload',
};

@Injectable()
export class FileInterceptor implements NestInterceptor {
  constructor(private fieldName: string, private options?: Partial<Options>) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = Object.assign({}, defaultOptions, this.options);

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const body: any = {};
    const file: File = {};
    let shouldHandle = true;

    Logger.debug(`Expecting field: ${this.fieldName}`, LOG_CONTEXT, false);

    const uploadPath = normalize(options.uploadDir);
    fs.ensureDirSync(uploadPath);

    const streamConsumer = (
      field: string,
      stream: any,
      filename: string,
      encoding: string,
      mimetype: string
    ): void => {
      shouldHandle = field === this.fieldName;

      if (shouldHandle) {
        Logger.debug(`Handling: ${filename} (${mimetype})`, LOG_CONTEXT);

        file.uuid = uuid();
        file.encoding = encoding;
        file.fieldname = field;
        file.filename = `${file.uuid}.${extension(mimetype)}`;
        file.mimetype = mimetype;
        file.originalname = filename;
        file.tempfile = `${uploadPath}/${file.filename}`;

        const writeStream = fs.createWriteStream(file.tempfile);

        pump(stream, writeStream);
      } else {
        Logger.debug(`Skipping field: ${field}`, LOG_CONTEXT);

        stream.resume();
      }
    };

    const handleField = (key: string, value: any) => {
      body[key] = value;
    };

    await new Promise((resolve, reject) => {
      const multipart = req.multipart(streamConsumer, error => {
        if (error) {
          Logger.warn(`Failed: ${error.message}`, LOG_CONTEXT);

          return reject(new BadRequestException(error));
        }

        req.body = body;

        if (shouldHandle) {
          file.filesize = fs.statSync(file.tempfile).size;
          req.file = file;
        }

        resolve();
      });

      multipart.on('field', handleField);
    });

    const cleanUp = () => {
      if (file.tempfile && fs.pathExistsSync(file.tempfile)) {
        Logger.debug(`Removing ${file.tempfile}`, LOG_CONTEXT);

        fs.removeSync(file.tempfile);
      }
    };

    return next.handle().pipe(
      tap(() => {
        cleanUp();
      }),
      catchError(error => {
        cleanUp();

        return throwError(error);
      })
    );
  }
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
