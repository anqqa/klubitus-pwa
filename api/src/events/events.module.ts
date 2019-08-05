import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { GalleriesModule } from '../galleries/galleries.module';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  exports: [EventsService],
  imports: [AuthModule, GalleriesModule, TypeOrmModule.forFeature([Event])],
  providers: [EventsService],
})
export class EventsModule {}
