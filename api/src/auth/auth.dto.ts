// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { User } from '../users/users.dto';

export class FacebookPayload {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly access_token: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly external_user_id: number;
}

export class FacebookResponse {
  @ApiModelPropertyOptional()
  @Expose()
  email?: string;

  @ApiModelPropertyOptional()
  @Expose()
  existing?: boolean;

  @ApiModelPropertyOptional()
  @Expose()
  name?: string;
}

export class LoginPayload {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly username: string;
}

export class LoginResponse {
  @ApiModelProperty()
  @Expose()
  token: string;

  @ApiModelProperty()
  @Expose()
  @Type(() => User)
  user: User;
}
