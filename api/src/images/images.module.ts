import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments/comment.entity';

import { GalleriesController } from './galleries/galleries.controller';
import { GalleriesService } from './galleries/galleries.service';
import { Gallery } from './galleries/gallery.entity';
import { Image } from './image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Note } from './notes/note.entity';

@Module({
  controllers: [GalleriesController, ImagesController],
  imports: [TypeOrmModule.forFeature([Comment, Gallery, Image, Note])],
  providers: [GalleriesService, ImagesService],
})
export class ImagesModule {}
