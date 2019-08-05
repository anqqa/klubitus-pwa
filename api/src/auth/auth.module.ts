import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { External } from '../users/externals/external.entity';
import { Token } from '../users/tokens/token.entity';
import { User } from '../users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookService } from './facebook.service';
import { HttpStrategy } from './http.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
  imports: [
    PassportModule.register({ defaultStrategy: 'bearer' }),
    TypeOrmModule.forFeature([External, Token, User]),
  ],
  providers: [AuthService, FacebookService, HttpStrategy],
})
export class AuthModule {}
