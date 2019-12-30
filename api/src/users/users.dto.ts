// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';

import { IsUnique } from '../common/validators/IsUnique';
import { User as UserEntity } from './user.entity';

@Exclude()
export class User {
  @ApiPropertyOptional()
  @Expose()
  avatar_url?: string;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;
}

export class CreatePayload {
  @ApiProperty()
  @IsEmail()
  @Validate(IsUnique, [UserEntity])
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsUnique, [UserEntity])
  readonly username: string;
}
