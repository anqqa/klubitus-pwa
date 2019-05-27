import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthModule } from './auth/auth.module';
import DatabaseModule from './db.module';
import { EventsModule } from './events/events.module';
import { ForumModule } from './forum/forum.module';
import { ImagesModule } from './images/images.module';
import { NewsfeedModule } from './newsfeed/newsfeed.module';
import { ShoutsModule } from './shouts/shouts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    EventsModule,
    ForumModule,
    ImagesModule,
    NewsfeedModule,
    ShoutsModule,
    UsersModule,
  ],
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
