// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

import { User } from '../users/users.dto';

export class Image {
  @ApiModelPropertyOptional()
  author?: User;

  @ApiModelPropertyOptional()
  author_id?: number;

  @ApiModelPropertyOptional()
  color?: string;

  @ApiModelProperty()
  comment_count: number;

  @ApiModelProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiModelPropertyOptional()
  description?: string;

  @ApiModelPropertyOptional()
  exif?: Record<string, string | number>;

  @ApiModelPropertyOptional()
  height?: number;

  @ApiModelProperty()
  id: number;

  @ApiModelPropertyOptional()
  labels?: object;

  @ApiModelPropertyOptional()
  mime_type?: string;

  @ApiModelPropertyOptional()
  path?: string;

  @ApiModelPropertyOptional()
  postfix?: string;

  @ApiModelPropertyOptional({ format: 'uuid' })
  uuid?: string;

  @ApiModelProperty()
  view_count: number;

  @ApiModelPropertyOptional()
  width?: number;
}
