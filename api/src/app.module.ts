import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import DatabaseModule from './db.module';
import { EventsModule } from './events/events.module';
import { ForumModule } from './forum/forum.module';
import { ImagesModule } from './images/images.module';
import { NewsfeedModule } from './newsfeed/newsfeed.module';
import { ShoutsModule } from './shouts/shouts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    EventsModule,
    ForumModule,
    ImagesModule,
    ShoutsModule,
    UsersModule,
    NewsfeedModule,
  ],
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
