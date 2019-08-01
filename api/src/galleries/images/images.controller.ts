import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiImplicitFile, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import * as fs from 'fs-extra';

import { FileInterceptor } from '../../common/interceptors/file.interceptor';
import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';
import { GalleriesService } from '../galleries.service';
import { GalleryImage } from './image.entity';
import { GalleryImagesService } from './images.service';

@Crud({
  model: { type: GalleryImage },
  params: {
    galleryId: { field: 'gallery.id', type: 'number' },
    id: { field: 'id', type: 'number', primary: true },
  },
  query: {
    join: {
      author: { allow: ['avatar_url', 'id', 'signature', 'title', 'username'] },
      comments: {},
      gallery: { allow: ['id'], eager: true },
      notes: {},
    },
  },
  routes: {
    getManyBase: {
      interceptors: [new TransformerInterceptor(GalleryImage, true)],
    },
    getOneBase: {
      interceptors: [new TransformerInterceptor(GalleryImage, true)],
    },
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiUseTags('Images')
@Controller('/galleries/:galleryId/images')
export class GalleryImagesController implements CrudController<GalleryImage> {
  constructor(
    readonly service: GalleryImagesService,
    readonly galleriesService: GalleriesService
  ) {}

  get base(): CrudController<GalleryImage> {
    return this;
  }

  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(new FileInterceptor('file'))
  @Post()
  async upload(@Param() params: any, @Body() body: any, @UploadedFile('file') file: any) {
    const galleryId = parseInt(params.galleryId, 10);
    const gallery = await this.galleriesService.findOne(galleryId);

    if (!gallery) {
      throw new NotFoundException(`Gallery ${galleryId} not found`);
    }

    // console.log({ gallery, galleryId, body, file });

    return 'ok';
    // return Promise.resolve('ok');
    // try {
    //   await this.imageUploadService.handleUpload(request, response);
    // } catch (error) {
    //   return response.status(500).json(error.message);
    // }
  }
}
