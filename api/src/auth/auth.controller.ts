import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { User } from '../users/users.dto';
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

  @ApiOperation({ title: 'Get authenticated user info' })
  @ApiOkResponse({ description: 'Success', type: User })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(new TransformerInterceptor(User))
  @Get('me')
  me(@Req() req: any): User {
    return req.user;
  }
}
