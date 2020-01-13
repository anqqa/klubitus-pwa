// tslint:disable:variable-name
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  post: string;
}
