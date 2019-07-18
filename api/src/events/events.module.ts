import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  exports: [EventsService],
  imports: [AuthModule, TypeOrmModule.forFeature([Event])],
  providers: [EventsService],
})
export class EventsModule {}
