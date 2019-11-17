import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { GalleriesModule } from '../galleries/galleries.module';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { Favorite } from './favorites/favorite.entity';
import { FavoritesController } from './favorites/favorites.controller';
import { FavoritesService } from './favorites/favorites.service';

@Module({
  controllers: [EventsController, FavoritesController],
  exports: [EventsService],
  imports: [AuthModule, GalleriesModule, TypeOrmModule.forFeature([Event, Favorite])],
  providers: [EventsService, FavoritesService],
})
export class EventsModule {}
