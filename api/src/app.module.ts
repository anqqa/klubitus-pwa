import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import { EventsModule } from './events/events.module';
import { ForumModule } from './forum/forum.module';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';

import DatabaseModule from './db.module';

@Module({ imports: [DatabaseModule, EventsModule, ForumModule, ImagesModule, UsersModule] })
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
