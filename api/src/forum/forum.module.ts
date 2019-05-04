import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Area } from './areas/area.entity';
import { AreasController } from './areas/areas.controller';
import { AreasService } from './areas/areas.service';
import { Post } from './posts/post.entity';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { Topic } from './topics/topic.entity';
import { TopicsController } from './topics/topics.controller';
import { TopicsService } from './topics/topics.service';
import { User } from './users/user.entity';

@Module({
  controllers: [AreasController, PostsController, TopicsController],
  imports: [TypeOrmModule.forFeature([Area, Post, Topic, User])],
  providers: [AreasService, PostsService, TopicsService],
})
export class ForumModule {}
