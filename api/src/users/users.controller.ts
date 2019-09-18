import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { LoginResponse } from '../auth/auth.dto';
import { AuthService } from '../auth/auth.service';
import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { allow, exclude, User } from './user.entity';
import { CreatePayload } from './users.dto';
import { UsersService } from './users.service';

@Crud({
  model: { type: User },
  query: { allow, exclude },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiUseTags('Users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(readonly service: UsersService, readonly authService: AuthService) {}

  get base(): CrudController<User> {
    return this;
  }

  @ApiOperation({ title: 'Create a user' })
  @ApiCreatedResponse({ description: 'Success', type: LoginResponse })
  @ApiBadRequestResponse({ description: 'Validation failed. Returns field(s) with error(s).' })
  @UseInterceptors(new TransformerInterceptor(LoginResponse))
  @Post()
  async create(@Body() payload: CreatePayload): Promise<any> {
    const user = await this.service.create(payload);
    const token = await this.authService.generateToken(user);

    return { token, user };
  }
}
