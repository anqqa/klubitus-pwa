import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const { raw: req } = context.switchToHttp().getRequest();

    const logRequest = (status: number = HttpStatus.OK) =>
      Logger.debug(
        `[${status} ${HttpStatus[status]}] [${req.method}] ${req.url} ${Date.now() - startTime}ms`,
        'Request',
        false
      );

    return next.handle().pipe(
      tap(() => {
        const { res } = context.switchToHttp().getResponse();

        logRequest(res.statusCode);
      }),
      catchError((error: any) => {
        const status =
          error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        logRequest(status);

        return throwError(error);
      })
    );
  }
}
