// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

import { DPagination } from '../common/pagination/pagination.dto';
import { IsSortString } from '../common/validators/IsSortString';

export class DEvent {
  @ApiModelProperty({ type: String, format: 'date-time' })
  begins_at: Date;
  @ApiModelPropertyOptional()
  city_name?: string;
  @ApiModelProperty({ type: String, format: 'date-time' })
  created_at: Date;
  @ApiModelProperty({ type: String, format: 'date-time' })
  ends_at: Date;
  @ApiModelPropertyOptional()
  facebook_id?: number;
  @ApiModelPropertyOptional()
  flyer_front_url?: string;
  @ApiModelProperty()
  id: number;
  @ApiModelPropertyOptional()
  info?: string;
  @ApiModelProperty()
  name: string;
  @ApiModelPropertyOptional()
  venue_name?: string;
}

export class DEventsQuery extends DPagination {
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
