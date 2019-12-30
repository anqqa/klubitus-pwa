// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { User } from '../../users/users.dto';
import { Image } from '../images.dto';

export class Note {
  @ApiProperty()
  @Expose()
  @Type(() => User)
  author?: User;

  @ApiProperty()
  @Expose()
  author_id: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiPropertyOptional()
  @Expose()
  height?: number;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  @Type(() => Image)
  image: Image;

  @ApiProperty()
  @Expose()
  image_id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => User)
  user?: User;

  @ApiPropertyOptional()
  @Expose()
  user_id?: number;

  @ApiPropertyOptional()
  @Expose()
  width?: number;

  @ApiPropertyOptional()
  @Expose()
  x?: number;

  @ApiPropertyOptional()
  @Expose()
  y?: number;
}
