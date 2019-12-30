import {
  Controller,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { RequestUser } from '../../auth/requestuser.decorator';
import { File, FileInterceptor, FileUploadDto } from '../../common/interceptors/file.interceptor';
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
      'comments.author': {
        alias: 'commentator',
        allow: ['avatar_url', 'id', 'signature', 'title', 'username'],
      },
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
@ApiTags('Images')
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
  @ApiBody({ type: FileUploadDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(new FileInterceptor('file'))
  @Post()
  async upload(
    @Param() params: any,
    @RequestUser() user: any,
    @UploadedFile('file') file: File
  ): Promise<GalleryImage> {
    const galleryId = parseInt(params.galleryId, 10);
    const gallery = await this.galleriesService.findOne(galleryId);

    if (!gallery) {
      throw new NotFoundException(`Gallery ${galleryId} not found`);
    }

    return this.service.createToGallery(user.id, file, gallery);
  }
}
