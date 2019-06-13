// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';
import { User } from '../users/users.dto';

export class Post {
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
  forum_area_id: number;

  @ApiModelProperty()
  @Expose()
  forum_topic_id: number;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelPropertyOptional()
  @Expose()
  parent_id: number;

  @ApiModelProperty()
  @Expose()
  post: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  updated_at: Date;
}

export class PostsQuery extends Pagination {
  @ApiModelProperty({ description: 'Topic ID.' })
  @Transform((topic_id: string) => parseInt(topic_id, 10))
  @IsNumber()
  topic_id: number;
}
