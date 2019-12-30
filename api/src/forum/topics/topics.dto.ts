// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';
import { Area } from '../areas/areas.dto';
import { Post } from '../posts/posts.dto';
import { User } from '../users/users.dto';

export class Topic {
  @ApiPropertyOptional()
  @Expose()
  @Type(() => Area)
  area?: Area;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => User)
  author?: User;

  @ApiProperty()
  @Expose()
  author_name: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  first_post_id: number;

  @ApiProperty()
  @Expose()
  forum_area_id: number;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiPropertyOptional()
  @Expose()
  is_locked?: boolean;

  @ApiPropertyOptional()
  @Expose()
  is_sinking?: boolean;

  @ApiPropertyOptional()
  @Expose()
  is_sticky?: boolean;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => Post)
  last_post?: Post;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  last_post_at: Date;

  @ApiProperty()
  @Expose()
  last_post_id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  post_count: number;

  @ApiProperty()
  @Expose()
  read_count: number;
}

export class TopicsQuery extends Pagination {
  @ApiPropertyOptional({ description: 'Filter topics by an area.' })
  @Transform((area_id: string) => parseInt(area_id, 10))
  @IsOptional()
  @IsNumber()
  area_id?: number;
}
