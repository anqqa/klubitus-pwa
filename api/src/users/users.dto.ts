// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';

import { IsUnique } from '../common/validators/IsUnique';
import { User as UserEntity } from './user.entity';

@Exclude()
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

export class CreatePayload {
  @ApiModelProperty()
  @IsEmail()
  @Validate(IsUnique, [UserEntity])
  readonly email: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @Validate(IsUnique, [UserEntity])
  readonly username: string;
}
