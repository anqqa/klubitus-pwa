// tslint:disable:variable-name
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { User } from '../users/users.dto';

@Expose()
export class Shout {
  @ApiModelProperty()
  @Type(() => User)
  author: User;

  @ApiModelProperty()
  author_id: number;

  @ApiModelProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  shout: string;
}
