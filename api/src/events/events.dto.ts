// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsISO8601, IsOptional } from 'class-validator';

import { Pagination } from '../common/pagination/pagination.dto';
import { IsSortString } from '../common/validators/IsSortString';

export class Event {
  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  begins_at: Date;

  @ApiModelPropertyOptional()
  @Expose()
  city_name?: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  ends_at: Date;

  @ApiModelPropertyOptional()
  @Expose()
  facebook_id?: number;

  @ApiModelPropertyOptional()
  @Expose()
  flyer_front_url?: string;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelPropertyOptional()
  @Expose()
  info?: string;

  @ApiModelProperty()
  @Expose()
  name: string;

  @ApiModelPropertyOptional()
  @Expose()
  venue_name?: string;
}

export class EventsQuery extends Pagination {
  @ApiModelPropertyOptional({
    description: 'List events starting after date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  from?: Date;

  @ApiModelPropertyOptional({
    description: 'List events ending before date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  to?: Date;

  @ApiModelPropertyOptional({
    description: 'Sort events by column.',
    pattern: '^[+-]?(begins_at|created_at|id|updated_at)$',
  })
  @IsOptional()
  @IsSortString(['begins_at', 'created_at', 'id', 'updated_at'])
  sort?: string;
}
