import { Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiImplicitFile,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';
import { ImageUploadService } from '../upload/imageupload.service';
import { Stats } from './galleries.dto';
import { GalleriesService } from './galleries.service';
import { Gallery } from './gallery.entity';

@Crud({
  model: { type: Gallery },
  query: {
    join: {
      default_image: {},
      event: {},
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiUseTags('Images')
@Controller('galleries')
export class GalleriesController implements CrudController<Gallery> {
  constructor(
    readonly service: GalleriesService,
    readonly imageUploadService: ImageUploadService
  ) {}

  get base(): CrudController<Gallery> {
    return this;
  }

  @ApiOperation({ title: 'Get gallery statistics' })
  @ApiOkResponse({ type: Stats, isArray: true })
  @UseInterceptors(new TransformerInterceptor(Stats))
  @Get('/stats')
  async getStats() {
    return this.service.getStats();
  }

  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post('upload')
  async upload(@Req() request: any, @Res() response: any) {
    try {
      await this.imageUploadService.handleUpload(request, response);
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }
}
