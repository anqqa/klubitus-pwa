// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsISO8601, IsOptional } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';
import { Event } from '../../events/events.dto';
import { Image } from '../images.dto';

export class Gallery {
  @ApiModelProperty()
  @Expose()
  copyright: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => Image)
  default_image?: Image;

  @ApiModelPropertyOptional()
  @Expose()
  default_image_id?: number;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => Event)
  event?: Event;

  @ApiModelProperty({ type: String, format: 'date' })
  @Expose()
  event_date: Date;

  @ApiModelProperty()
  @Expose()
  event_id: number;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelProperty()
  @Expose()
  image_count: number;

  @ApiModelProperty()
  @Expose()
  name: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  updated_at: Date;
}

export class GalleriesQuery extends Pagination {
  @ApiModelPropertyOptional({
    description: 'List galleries starting after date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  from?: Date;

  @ApiModelPropertyOptional({
    description: 'List galleries ending before date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  to?: Date;

  @ApiModelPropertyOptional({ description: 'Filter galleries by event ID.' })
  @IsOptional()
  event_id?: number;
}
