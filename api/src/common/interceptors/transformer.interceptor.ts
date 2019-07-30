import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ClassType<T> = new () => T;

@Injectable()
export class TransformerInterceptor<T> implements NestInterceptor {
  constructor(private readonly classType: ClassType<T>, private readonly expose = false) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<T | T[]> | Promise<Observable<T | T[]>> {
    const options: ClassTransformOptions = { strategy: this.expose ? 'exposeAll' : 'excludeAll' };

    return next.handle().pipe(map(data => plainToClass(this.classType, data, options)));
  }
}
