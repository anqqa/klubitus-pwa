// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';
import { User } from '../users/users.dto';

export class Post {
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
  forum_area_id: number;

  @ApiProperty()
  @Expose()
  forum_topic_id: number;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiPropertyOptional()
  @Expose()
  parent_id: number;

  @ApiProperty()
  @Expose()
  post: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  updated_at: Date;
}

export class PostsQuery extends Pagination {
  @ApiProperty({ description: 'Topic ID.' })
  @Transform((topic_id: string) => parseInt(topic_id, 10))
  @IsNumber()
  topic_id: number;
}
