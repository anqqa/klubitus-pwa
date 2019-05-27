// tslint:disable:max-classes-per-file
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { User } from '../users/users.dto';

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
