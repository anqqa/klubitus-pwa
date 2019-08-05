import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { AwsModule } from '../common/aws/aws.module';
import { Event } from '../events/event.entity';
import { GalleriesController } from './galleries.controller';
import { GalleriesService } from './galleries.service';
import { Gallery } from './gallery.entity';
import { GalleryImage } from './images/image.entity';
import { GalleryImagesController } from './images/images.controller';
import { GalleryImagesService } from './images/images.service';

@Module({
  controllers: [GalleriesController, GalleryImagesController],
  exports: [GalleriesService, GalleryImagesService],
  imports: [
    AuthModule,
    AwsModule.forRoot(
      process.env.AWS_DEFAULT_REGION,
      process.env.AWS_BUCKET,
      process.env.AWS_IMAGE_PREFIX,
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY
    ),
    TypeOrmModule.forFeature([Event, Gallery, GalleryImage]),
  ],
  providers: [GalleriesService, GalleryImagesService],
})
export class GalleriesModule {}
