import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.debug(
            `${request.raw.method} ${request.raw.url} ${Date.now() - startTime}ms`,
            'Request',
            false,
          ),
        ),
      );
  }
}
