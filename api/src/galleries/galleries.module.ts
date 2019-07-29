import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GalleriesController, GalleriesService, Gallery } from '.';
import { AuthModule } from '../auth';
import { AwsModule } from '../common/aws/aws.module';
import { Event } from '../events';
import { EventsModule } from '../events/events.module';
import { Image, ImagesModule } from '../images';
import { GalleryImage, GalleryImagesController, GalleryImagesService } from './images';

@Module({
  controllers: [GalleriesController, GalleryImagesController],
  // exports: [GalleriesService],
  imports: [
    AuthModule,
    AwsModule.forRoot(
      process.env.AWS_DEFAULT_REGION,
      process.env.AWS_BUCKET,
      process.env.AWS_IMAGE_PREFIX,
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY
    ),
    EventsModule,
    ImagesModule,
    TypeOrmModule.forFeature([Event, Gallery, GalleryImage]),
  ],
  providers: [GalleriesService, GalleryImagesService /*, ImageUploadService*/],
})
export class GalleriesModule {}
