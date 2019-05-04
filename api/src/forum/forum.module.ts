import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Area } from './areas/area.entity';
import { AreasController } from './areas/areas.controller';
import { AreasService } from './areas/areas.service';
import { Topic } from './topics/topic.entity';
import { TopicsController } from './topics/topics.controller';
import { TopicsService } from './topics/topics.service';

@Module({
  controllers: [AreasController, TopicsController],
  imports: [TypeOrmModule.forFeature([Area, Topic])],
  providers: [AreasService, TopicsService],
})
export class ForumModule {}
