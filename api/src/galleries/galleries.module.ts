import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GalleriesController, GalleriesService, Gallery } from '.';
import { AuthModule } from '../auth';
import { AwsModule } from '../common/aws/aws.module';
import { Event } from '../events';
import { Image } from '../images/image.entity';
import { ImagesModule } from '../images/images.module';
import { ImagesService } from '../images/images.service';
import { ImageUploadService } from './upload/imageupload.service';

@Module({
  controllers: [GalleriesController],
  imports: [
    AuthModule,
    AwsModule.forRoot(
      process.env.AWS_DEFAULT_REGION,
      process.env.AWS_BUCKET,
      process.env.AWS_IMAGE_PREFIX,
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY
    ),
    ImagesModule,
    TypeOrmModule.forFeature([Event, Gallery, Image]),
  ],
  providers: [GalleriesService, ImagesService, ImageUploadService],
})
export class GalleriesModule {}
