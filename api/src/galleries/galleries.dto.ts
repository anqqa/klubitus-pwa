// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsISO8601, IsOptional } from 'class-validator';

import { Pagination } from '../common/pagination/pagination.dto';
import { Event } from '../events/events.dto';
import { Image } from '../images/images.dto';

@Expose()
export class Gallery {
  @ApiProperty()
  copyright: string;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiPropertyOptional()
  @Type(() => Image)
  default_image?: Image;

  @ApiPropertyOptional()
  default_image_id?: number;

  @ApiPropertyOptional()
  @Type(() => Event)
  event?: Event;

  @ApiProperty({ type: String, format: 'date' })
  event_date: Date;

  @ApiProperty()
  event_id: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  image_count: number;

  @ApiPropertyOptional({ type: Image, isArray: true })
  @Type(() => Image)
  images: Image[];

  @ApiProperty()
  name: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updated_at: Date;
}

export class GalleriesQuery extends Pagination {
  @ApiPropertyOptional({
    description: 'List galleries starting after date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  from?: Date;

  @ApiPropertyOptional({
    description: 'List galleries ending before date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  to?: Date;

  @ApiPropertyOptional({ description: 'Filter galleries by event ID.' })
  @IsOptional()
  event_id?: number;
}

@Expose()
export class Stats {
  @ApiProperty()
  @Type(() => Number)
  gallery_count: number;

  @ApiProperty()
  @Type(() => Number)
  image_count: number;

  @ApiProperty()
  @Type(() => Number)
  month: number;

  @ApiProperty()
  @Type(() => Number)
  year: number;
}
