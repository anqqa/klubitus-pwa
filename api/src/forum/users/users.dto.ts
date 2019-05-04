import { ApiModelPropertyOptional } from '@nestjs/swagger';

import { User as BaseUser } from '../../users/users.dto';

export class User extends BaseUser {
  @ApiModelPropertyOptional({ description: 'Only available in forum.' })
  signature?: string;

  @ApiModelPropertyOptional({ description: 'Only available in forum.' })
  title?: string;
}
