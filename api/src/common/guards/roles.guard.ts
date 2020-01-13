import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '../utils/role.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const wantedRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!wantedRoles || !wantedRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const hasRoles: string[] = request.user ? request.user.roles : [Roles.UNAUTHENTICATED];
    const canActivate = hasRoles.some(role => wantedRoles.includes(role));

    if (!canActivate) {
      Logger.warn(`Failed roles guard: ${hasRoles.join(', ')} vs ${wantedRoles.join(', ')}`, 'ACL');
    }

    return canActivate;
  }
}
