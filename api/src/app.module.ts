import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { AuthModule } from './auth';
import DbModule from './db.module';
import { EventsModule } from './events/events.module';
import { ForumModule } from './forum/forum.module';
import { GalleriesModule } from './galleries/galleries.module';
import { ImagesModule } from './images/images.module';
import { NewsfeedModule } from './newsfeed/newsfeed.module';
import { ShoutsModule } from './shouts/shouts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    DbModule,
    EventsModule,
    ForumModule,
    GalleriesModule,
    ImagesModule,
    NewsfeedModule,
    ShoutsModule,
    UsersModule,
  ],
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
