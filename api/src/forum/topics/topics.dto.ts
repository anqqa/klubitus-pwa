// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';

export class Topic {
  @ApiModelProperty()
  author_name: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiModelProperty()
  first_post_id: number;

  @ApiModelProperty()
  forum_area_id: number;

  @ApiModelProperty()
  id: number;

  @ApiModelPropertyOptional()
  is_locked?: boolean;

  @ApiModelPropertyOptional()
  is_sinking?: boolean;

  @ApiModelPropertyOptional()
  is_sticky?: boolean;

  @ApiModelProperty({ type: String, format: 'date-time' })
  last_post_at: Date;

  @ApiModelProperty()
  last_post_id: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  post_count: number;

  @ApiModelProperty()
  read_count: number;
}

export class TopicsQuery extends Pagination {
  @ApiModelPropertyOptional({ description: 'Filter topics by an area.' })
  @Transform((area_id: string) => parseInt(area_id, 10))
  @IsOptional()
  @IsNumber()
  area_id?: number;
}
