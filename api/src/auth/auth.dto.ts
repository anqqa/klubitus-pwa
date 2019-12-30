// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { User } from '../users/users.dto';

export class FacebookPayload {
  @ApiProperty()
  @IsNotEmpty()
  readonly access_token: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly external_user_id: number;
}

export class FacebookResponse {
  @ApiPropertyOptional()
  @Expose()
  email?: string;

  @ApiPropertyOptional()
  @Expose()
  is_new_user?: boolean;

  @ApiPropertyOptional()
  @Expose()
  name?: string;
}

export class LoginPayload {
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;
}

export class LoginResponse {
  @ApiProperty()
  @Expose()
  token: string;

  @ApiProperty()
  @Expose()
  @Type(() => User)
  user: User;
}
