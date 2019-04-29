// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

import { DPagination } from '../common/pagination/pagination.dto';

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
    description: 'Sort events by column.',
    pattern: '^[+-]?(begins_at|created_at|id|updated_at)$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[+-]?(begins_at|created_at|id|updated_at)$/g)
  sort?: string;
}
