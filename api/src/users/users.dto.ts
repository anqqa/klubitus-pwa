// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiModelPropertyOptional()
  avatar_url?: string;

  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  username: string;
}
