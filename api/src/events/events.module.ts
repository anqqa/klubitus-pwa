import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService],
})
export class EventsModule {}
