import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { External } from './externals/external.entity';
import { Token } from './tokens/token.entity';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([External, Token, User])],
  providers: [UsersService],
})
export class UsersModule {}
