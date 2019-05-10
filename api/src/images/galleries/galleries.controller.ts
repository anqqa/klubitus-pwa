import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';

import { GalleriesQuery, Gallery } from './galleries.dto';
import { GalleriesService } from './galleries.service';

@ApiUseTags('Images')
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @ApiOperation({ title: 'List galleries' })
  @ApiOkResponse({ description: 'Success', type: Gallery, isArray: true })
  @UseInterceptors(new TransformerInterceptor(Gallery))
  @Get()
  async getAll(@Query() query: GalleriesQuery) {
    return await this.galleriesService.findAll(query);
  }
}
