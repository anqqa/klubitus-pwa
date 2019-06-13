// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { User } from '../../users/users.dto';
import { Image } from '../images.dto';

export class Note {
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

  @ApiModelPropertyOptional()
  @Expose()
  height?: number;

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
  name: string;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => User)
  user?: User;

  @ApiModelPropertyOptional()
  @Expose()
  user_id?: number;

  @ApiModelPropertyOptional()
  @Expose()
  width?: number;

  @ApiModelPropertyOptional()
  @Expose()
  x?: number;

  @ApiModelPropertyOptional()
  @Expose()
  y?: number;
}
