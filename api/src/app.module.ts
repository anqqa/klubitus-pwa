import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import DatabaseModule from './db.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [DatabaseModule, EventsModule],
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
