// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class User {
  @ApiModelPropertyOptional()
  @Expose()
  avatar_url?: string;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelProperty()
  @Expose()
  username: string;
}
