import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiImplicitFile, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';

import { GalleryImage } from './image.entity';
import { GalleryImagesService } from './images.service';
import { ImageUploadService } from './imageupload.service';

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
    readonly service: GalleryImagesService // readonly imageUploadService: ImageUploadService
  ) {}

  get base(): CrudController<GalleryImage> {
    return this;
  }

  // @ApiConsumes('multipart/form-data')
  // @ApiImplicitFile({ name: 'file', required: true })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @Post('upload')
  // async upload(@Req() request: any, @Res() response: any) {
  //   try {
  //     await this.imageUploadService.handleUpload(request, response);
  //   } catch (error) {
  //     return response.status(500).json(error.message);
  //   }
  // }
}
