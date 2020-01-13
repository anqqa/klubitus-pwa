import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

@Injectable()
export class PrivateGuard extends AuthGuard('bearer') implements IAuthGuard {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check authenticated user for so we get our user injected in the context
    const isAuthenticated = (await super.canActivate(context)) as boolean;

    const isPrivate = !!this.reflector.get<boolean>('isPrivate', context.getHandler());
    const canActivate = !isPrivate || isAuthenticated;

    if (!canActivate) {
      Logger.warn(
        `Failed private guard, isPrivate: ${!!isPrivate}, isAuthenticated: ${!!isAuthenticated}`,
        'ACL'
      );
    }

    return canActivate;
  }

  handleRequest<T>(err: any, user?: T): T | undefined {
    if (err) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
