import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './comments/comment.entity';
import { Image } from './image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Note } from './notes/note.entity';

@Module({
  controllers: [ImagesController],
  imports: [TypeOrmModule.forFeature([Comment, Image, Note])],
  providers: [ImagesService],
})
export class ImagesModule {}
