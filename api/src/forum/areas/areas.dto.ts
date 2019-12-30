// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { Topic } from '../topics/topics.dto';

export class Area {
  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  is_moderated: boolean;

  @ApiProperty()
  @Expose()
  is_private: boolean;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => Topic)
  last_topic?: Topic;

  @ApiPropertyOptional()
  @Expose()
  last_topic_id?: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  nest_depth: number;

  @ApiProperty()
  @Expose()
  nest_left: number;

  @ApiProperty()
  @Expose()
  nest_right: number;

  @ApiPropertyOptional()
  @Expose()
  parent_id?: number;

  @ApiProperty()
  @Expose()
  post_count: number;

  @ApiProperty()
  @Expose()
  topic_count: number;
}

export class AreasQuery {
  @ApiProperty()
  @IsOptional()
  details?: boolean;
}
