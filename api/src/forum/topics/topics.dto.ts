// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';
import { Area } from '../areas/areas.dto';
import { Post } from '../posts/posts.dto';
import { User } from '../users/users.dto';

export class Topic {
  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => Area)
  area?: Area;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => User)
  author?: User;

  @ApiModelProperty()
  @Expose()
  author_name: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiModelProperty()
  @Expose()
  first_post_id: number;

  @ApiModelProperty()
  @Expose()
  forum_area_id: number;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelPropertyOptional()
  @Expose()
  is_locked?: boolean;

  @ApiModelPropertyOptional()
  @Expose()
  is_sinking?: boolean;

  @ApiModelPropertyOptional()
  @Expose()
  is_sticky?: boolean;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => Post)
  last_post?: Post;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  last_post_at: Date;

  @ApiModelProperty()
  @Expose()
  last_post_id: number;

  @ApiModelProperty()
  @Expose()
  name: string;

  @ApiModelProperty()
  @Expose()
  post_count: number;

  @ApiModelProperty()
  @Expose()
  read_count: number;
}

export class TopicsQuery extends Pagination {
  @ApiModelPropertyOptional({ description: 'Filter topics by an area.' })
  @Transform((area_id: string) => parseInt(area_id, 10))
  @IsOptional()
  @IsNumber()
  area_id?: number;
}
