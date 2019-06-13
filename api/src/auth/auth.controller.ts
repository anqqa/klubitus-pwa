import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { User } from '../users/users.dto';
import { FacebookPayload, FacebookResponse, LoginPayload, LoginResponse } from './auth.dto';
import { AuthService } from './auth.service';

@ApiUseTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description:
      'Authenticated user: connect accounts.\n' +
      'Unauthenticated user: log in if accounts connected, offer login/register if not.',
    title: 'Connect with Facebook',
  })
  @ApiOkResponse({ description: 'Success' })
  @ApiConflictResponse({
    description: 'Facebook account mismatch, e.g. connected to another authenticated user',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('facebook')
  async facebook(
    @Body() payload: FacebookPayload,
    @Req() { user: authenticated }: any,
  ): Promise<LoginResponse | FacebookResponse | boolean> {
    const { access_token: fbToken, external_user_id: fbUserId } = payload;

    const { email, existing, name, user } = await this.authService.facebook(
      fbToken,
      fbUserId,
      authenticated,
    );

    if (user) {
      // Connected existing user?
      if (existing) {
        return true;
      }

      const token = await this.authService.generateToken(user);

      return plainToClass(LoginResponse, { token, user });
    }

    return plainToClass(FacebookResponse, { email, existing, name });
  }

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

  @ApiOperation({ title: 'Logout' })
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post('logout')
  async logout(@Headers('authorization') authorization: string): Promise<any> {
    const [bearer, token] = authorization.split(' ');

    await this.authService.deleteToken(token);
  }

  @ApiOperation({ title: 'Get authenticated user info' })
  @ApiOkResponse({ description: 'Success', type: User })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(new TransformerInterceptor(User))
  @Get('me')
  me(@Req() { user }: any): User {
    return user;
  }
}
