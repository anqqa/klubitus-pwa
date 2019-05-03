import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Area } from './area.entity';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';

@Module({
  controllers: [AreasController],
  imports: [TypeOrmModule.forFeature([Area])],
  providers: [AreasService],
})
export class ForumModule {}
