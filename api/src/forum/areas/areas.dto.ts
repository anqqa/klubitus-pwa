// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { Topic } from '../topics/topics.dto';

export class Area {
  @ApiModelPropertyOptional()
  @Expose()
  description?: string;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelProperty()
  @Expose()
  is_moderated: boolean;

  @ApiModelProperty()
  @Expose()
  is_private: boolean;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => Topic)
  last_topic?: Topic;

  @ApiModelPropertyOptional()
  @Expose()
  last_topic_id?: number;

  @ApiModelProperty()
  @Expose()
  name: string;

  @ApiModelProperty()
  @Expose()
  nest_depth: number;

  @ApiModelProperty()
  @Expose()
  nest_left: number;

  @ApiModelProperty()
  @Expose()
  nest_right: number;

  @ApiModelPropertyOptional()
  @Expose()
  parent_id?: number;

  @ApiModelProperty()
  @Expose()
  post_count: number;

  @ApiModelProperty()
  @Expose()
  topic_count: number;
}

export class AreasQuery {
  @ApiModelProperty()
  @IsOptional()
  details?: boolean;
}
