import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { Stats } from './galleries.dto';
import { GalleriesService } from './galleries.service';
import { Gallery } from './gallery.entity';

@Crud({
  model: { type: Gallery },
  query: {
    join: {
      default_image: { exclude: ['updated_at'] },
      event: {},
      images: {},
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiUseTags('Images')
@Controller('galleries')
export class GalleriesController implements CrudController<Gallery> {
  constructor(readonly service: GalleriesService) {}

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
}
