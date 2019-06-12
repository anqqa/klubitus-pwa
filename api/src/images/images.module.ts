import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { AwsModule } from '../common/aws/aws.module';
import { Event } from '../events/event.entity';
import { ColorService } from './color.service';
import { Comment } from './comments/comment.entity';
import { ExifService } from './exif.service';
import { GalleriesController } from './galleries/galleries.controller';
import { GalleriesService } from './galleries/galleries.service';
import { Gallery } from './galleries/gallery.entity';
import { Image } from './image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MetaService } from './meta.service';
import { Note } from './notes/note.entity';
import { PhashService } from './phash.service';
import { ImageUploadService } from './upload/imageupload.service';

@Module({
  controllers: [GalleriesController, ImagesController],
  imports: [
    AuthModule,
    AwsModule.forRoot(
      process.env.AWS_DEFAULT_REGION,
      process.env.AWS_BUCKET,
      process.env.AWS_IMAGE_PREFIX,
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY,
    ),
    TypeOrmModule.forFeature([Comment, Event, Gallery, Image, Note]),
  ],
  providers: [
    ColorService,
    ExifService,
    GalleriesService,
    ImagesService,
    ImageUploadService,
    MetaService,
    PhashService,
  ],
})
export class ImagesModule {}
