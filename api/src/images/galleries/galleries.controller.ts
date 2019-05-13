import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';
import { Pagination } from '../../common/pagination/pagination.dto';
import { Image } from '../images.dto';
import { GalleriesQuery, Gallery, Stats } from './galleries.dto';
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

  @ApiOperation({ title: 'Get gallery statistics' })
  @ApiOkResponse({ type: Stats, isArray: true })
  @UseInterceptors(new TransformerInterceptor(Stats))
  @Get('/stats')
  async getStats() {
    return await this.galleriesService.getStats();
  }

  @ApiOperation({ title: 'Get images of a gallery' })
  @ApiOkResponse({ type: Image, isArray: true })
  @ApiNotFoundResponse({ description: 'Gallery not found.' })
  @UseInterceptors(new TransformerInterceptor(Image))
  @Get('/:id/images')
  async getImagesById(@Param('id', new ParseIntPipe()) id: number, @Query() query: Pagination) {
    return await this.galleriesService.getImages(id, query);
  }

  @ApiOperation({ title: 'Get a gallery' })
  @ApiOkResponse({ type: Gallery })
  @ApiNotFoundResponse({ description: 'Gallery not found.' })
  @UseInterceptors(new TransformerInterceptor(Gallery))
  @Get('/:id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.galleriesService.get(id);
  }
}
