import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { IsUnique } from '../common/validators/IsUnique';
import DbModule from '../db.module';
import { External } from './externals/external.entity';
import { Token } from './tokens/token.entity';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [DbModule, TypeOrmModule.forFeature([External, Token, User]), AuthModule],
  providers: [IsUnique, UsersService],
})
export class UsersModule {}
