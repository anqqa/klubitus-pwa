import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';

import { LoginResponse } from '../auth/auth.dto';
import { AuthService } from '../auth/auth.service';
import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { CreatePayload } from './users.dto';
import { UsersService } from './users.service';

@ApiUseTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @ApiOperation({ title: 'Create a user' })
  @ApiCreatedResponse({ description: 'Success', type: LoginResponse })
  @ApiBadRequestResponse({ description: 'Validation failed. Returns field(s) with error(s).' })
  @UseInterceptors(new TransformerInterceptor(LoginResponse))
  @Post()
  async create(@Body() payload: CreatePayload): Promise<any> {
    const user = await this.usersService.create(payload);
    const token = await this.authService.generateToken(user);

    return { token, user };
  }
}
