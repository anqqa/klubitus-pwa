import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from './items/item.entity';
import { NewsfeedController } from './newsfeed.controller';
import { NewsfeedService } from './newsfeed.service';

@Module({
  controllers: [NewsfeedController],
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [NewsfeedService],
})
export class NewsfeedModule {}
