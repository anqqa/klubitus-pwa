// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { User } from '../../users/users.dto';
import { Image } from '../images.dto';

export class Comment {
  @ApiModelProperty()
  @Expose()
  @Type(() => User)
  author?: User;

  @ApiModelProperty()
  @Expose()
  author_id: number;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelProperty()
  @Expose()
  @Type(() => Image)
  image: Image;

  @ApiModelProperty()
  @Expose()
  image_id: number;

  @ApiModelProperty()
  @Expose()
  comment: string;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => User)
  user?: User;

  @ApiModelPropertyOptional()
  @Expose()
  user_id?: number;
}
