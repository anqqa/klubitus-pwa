import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Area, AreasController, AreasService } from './areas';
import { Post, PostsController, PostsService } from './posts';
import { Topic, TopicsController, TopicsService } from './topics';
import { User } from './users/user.entity';

@Module({
  controllers: [AreasController, PostsController, TopicsController],
  imports: [TypeOrmModule.forFeature([Area, Post, Topic, User])],
  providers: [AreasService, PostsService, TopicsService],
})
export class ForumModule {}
