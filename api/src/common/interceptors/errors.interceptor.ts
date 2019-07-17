import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { EntityForbiddenError } from '../errors/entityforbidden.error';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((error: any) => throwError(parseError(error))));
  }
}

const parseError = (error: Error): Error => {
  if (error instanceof EntityNotFoundError) {
    return new NotFoundException(error.message);
  }

  if (error instanceof EntityForbiddenError) {
    return new ForbiddenException(error.message);
  }

  return error;
};
