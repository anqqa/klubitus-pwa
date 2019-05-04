import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import DatabaseModule from './db.module';
import { EventsModule } from './events/events.module';
import { ForumModule } from './forum/forum.module';
import { UsersModule } from './users/users.module';

@Module({ imports: [DatabaseModule, EventsModule, ForumModule, UsersModule] })
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
