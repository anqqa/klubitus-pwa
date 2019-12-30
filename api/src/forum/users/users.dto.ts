import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { User as BaseUser } from '../../users/users.dto';

export class User extends BaseUser {
  @ApiPropertyOptional({ description: 'Only available in forum.' })
  @Expose()
  signature?: string;

  @ApiPropertyOptional({ description: 'Only available in forum.' })
  @Expose()
  title?: string;
}
