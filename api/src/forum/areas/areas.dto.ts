// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class Area {
  @ApiModelPropertyOptional()
  description?: string;

  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  is_moderated: boolean;

  @ApiModelProperty()
  is_private: boolean;

  @ApiModelPropertyOptional()
  last_topic_id?: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  nest_depth: number;

  @ApiModelProperty()
  nest_left: number;

  @ApiModelProperty()
  nest_right: number;

  @ApiModelPropertyOptional()
  parent_id?: number;

  @ApiModelProperty()
  post_count: number;

  @ApiModelProperty()
  topic_count: number;
}

export class AreasQuery {
  @ApiModelProperty()
  @IsOptional()
  details?: boolean;
}
