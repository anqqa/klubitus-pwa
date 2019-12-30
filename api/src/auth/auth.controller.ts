import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Response,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { FastifyReply } from 'fastify';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { User } from '../users/users.dto';
import { FacebookPayload, FacebookResponse, LoginPayload, LoginResponse } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description:
      'Authenticated user: connect accounts.\n' +
      'Unauthenticated user: log in if accounts connected, offer login/register if not.',
    summary: 'Connect with Facebook',
  })
  @ApiCreatedResponse({ description: 'Success', type: LoginResponse })
  @ApiOkResponse({ description: 'Not yet connected', type: FacebookResponse })
  @ApiResponse({
    description: 'Authenticated user already connected',
    status: HttpStatus.NO_CONTENT,
  })
  @ApiConflictResponse({
    description: 'Facebook account mismatch, e.g. connected to another authenticated user',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('facebook')
  async facebook(
    @Body() payload: FacebookPayload,
    @Req() { user: authenticated }: any,
    @Response() res: FastifyReply<any>
  ) {
    const { access_token: fbToken, external_user_id: fbUserId } = payload;

    const { email, connected, is_new_user, name, user } = await this.authService.facebook(
      fbToken,
      fbUserId,
      authenticated
    );

    if (user) {
      // Connected existing user?
      if (connected) {
        return res.status(HttpStatus.NO_CONTENT).send();
      }

      const token = await this.authService.generateToken(user);

      return res.status(HttpStatus.CREATED).send(plainToClass(LoginResponse, { token, user }));
    }

    return res
      .status(HttpStatus.OK)
      .send(plainToClass(FacebookResponse, { email, name, is_new_user }));
  }

  @ApiOperation({ summary: 'Login with email or username' })
  @ApiCreatedResponse({ description: 'Success', type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @UseInterceptors(new TransformerInterceptor(LoginResponse))
  @Post('login')
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user = await this.authService.login(payload);
    const token = await this.authService.generateToken(user);

    return { token, user };
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Headers('authorization') authorization: string): Promise<any> {
    const [bearer, token] = authorization.split(' ');

    await this.authService.deleteToken(token);
  }

  @ApiOperation({ summary: 'Get authenticated user info' })
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
