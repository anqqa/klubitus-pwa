import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { EntityForbiddenError } from '../errors/entityforbidden.error';

export const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

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

  if (error instanceof QueryFailedError && (error as any).code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
    return new ConflictException('Already exists');
  }

  return error;
};
