// tslint:disable:variable-name
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { User } from '../users/users.dto';

@Expose()
export class Shout {
  @ApiProperty()
  @Type(() => User)
  author: User;

  @ApiProperty()
  author_id: number;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiProperty()
  id: number;

  @ApiProperty()
  shout: string;
}
