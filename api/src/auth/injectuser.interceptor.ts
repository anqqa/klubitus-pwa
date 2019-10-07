import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

import { User } from '../users/user.entity';

const DEFAULT_KEY = 'user_id';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  constructor(private key: string = DEFAULT_KEY) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: FastifyRequest & { user?: User } = context.switchToHttp().getRequest();

    if (req.user) {
      if (['PATCH', 'POST', 'PUT'].includes(req.raw.method)) {
        req.body[this.key || DEFAULT_KEY] = req.user.id;
      }
    }

    return next.handle();
  }
}
