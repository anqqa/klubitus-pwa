// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';
import { User } from '../users/users.dto';

export class Post {
  @ApiModelPropertyOptional()
  author?: User;

  @ApiModelProperty()
  author_name: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiModelProperty()
  forum_area_id: number;

  @ApiModelProperty()
  forum_topic_id: number;

  @ApiModelProperty()
  id: number;

  @ApiModelPropertyOptional()
  parent_id: number;

  @ApiModelProperty()
  post: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  updated_at: Date;
}

export class PostsQuery extends Pagination {
  @ApiModelProperty({ description: 'Topic ID.' })
  @Transform((topic_id: string) => parseInt(topic_id, 10))
  @IsNumber()
  topic_id: number;
}
