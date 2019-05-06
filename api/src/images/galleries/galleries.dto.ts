// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';
import { Event } from '../../events/events.dto';

export class Gallery {
  @ApiModelProperty()
  copyright: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiModelPropertyOptional()
  default_image_id?: number;

  @ApiModelPropertyOptional()
  event?: Event;

  @ApiModelProperty({ type: String, format: 'date' })
  event_date: Date;

  @ApiModelProperty()
  event_id: number;

  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  image_count: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
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
