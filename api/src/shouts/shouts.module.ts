import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shout } from './shout.entity';
import { ShoutsController } from './shouts.controller';
import { ShoutsService } from './shouts.service';

@Module({
  controllers: [ShoutsController],
  imports: [TypeOrmModule.forFeature([Shout])],
  providers: [ShoutsService],
})
export class ShoutsModule {}
