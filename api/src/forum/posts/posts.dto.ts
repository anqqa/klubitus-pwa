// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { Pagination } from '../../common/pagination/pagination.dto';

export class Post {
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
  @ApiModelPropertyOptional({ description: 'Filter posts by a topic.' })
  @Transform((topic_id: string) => parseInt(topic_id, 10))
  @IsOptional()
  @IsNumber()
  topic_id?: number;
}
