import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { Private } from './private.decorator';
import { Roles } from './roles.decorator';

export const authDecorators = (...roles: string[]) => [
  Private(),
  Roles(...roles),
  ApiBearerAuth(),
  ApiUnauthorizedResponse({ description: 'Unauthorized' }),
];

export const Auth = (...roles: string[]) => applyDecorators(...authDecorators(...roles));
