import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse, ApiUseTags } from '@nestjs/swagger';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { LoginPayload, LoginResponse } from './auth.dto';
import { AuthService } from './auth.service';

@ApiUseTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ title: 'Login with email or username' })
  @ApiOkResponse({ description: 'Success', type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @UseInterceptors(new TransformerInterceptor(LoginResponse))
  @Post('login')
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user = await this.authService.login(payload);
    const token = await this.authService.generateToken(user);

    return { token, user };
  }
}
