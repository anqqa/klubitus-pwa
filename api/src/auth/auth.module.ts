import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';

@Module({
  controllers: [AuthController],
  imports: [PassportModule.register({ defaultStrategy: 'bearer' }), UsersModule],
  providers: [AuthService, HttpStrategy],
})
export class AuthModule {}
