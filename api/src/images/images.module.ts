import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GalleriesController } from './galleries/galleries.controller';
import { GalleriesService } from './galleries/galleries.service';
import { Gallery } from './galleries/gallery.entity';

@Module({
  controllers: [GalleriesController],
  imports: [TypeOrmModule.forFeature([Gallery])],
  providers: [GalleriesService],
})
export class ImagesModule {}
