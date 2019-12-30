// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsISO8601, IsOptional } from 'class-validator';

import { Pagination } from '../common/pagination/pagination.dto';
import { IsSortString } from '../common/validators/IsSortString';

export class Event {
  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  begins_at: Date;

  @ApiPropertyOptional()
  @Expose()
  city_name?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  ends_at: Date;

  @ApiPropertyOptional()
  @Expose()
  facebook_id?: number;

  @ApiPropertyOptional()
  @Expose()
  flyer_front_url?: string;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiPropertyOptional()
  @Expose()
  info?: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  venue_name?: string;
}

export class EventsQuery extends Pagination {
  @ApiPropertyOptional({
    description: 'List events starting after date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  from?: Date;

  @ApiPropertyOptional({
    description: 'List events ending before date.',
    format: 'date',
    type: String,
  })
  @IsOptional()
  @IsISO8601()
  to?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort events by column.',
    pattern: '^[+-]?(begins_at|created_at|id|updated_at)$',
  })
  @IsOptional()
  @IsSortString(['begins_at', 'created_at', 'id', 'updated_at'])
  sort?: string;
}
