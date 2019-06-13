import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { User as BaseUser } from '../../users/users.dto';

export class User extends BaseUser {
  @ApiModelPropertyOptional({ description: 'Only available in forum.' })
  @Expose()
  signature?: string;

  @ApiModelPropertyOptional({ description: 'Only available in forum.' })
  @Expose()
  title?: string;
}
