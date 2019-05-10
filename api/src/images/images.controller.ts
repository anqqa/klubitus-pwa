import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { Image } from './images.dto';
import { ImagesService } from './images.service';

@ApiUseTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ title: 'Get an image' })
  @ApiOkResponse({ type: Image })
  @ApiNotFoundResponse({ description: 'Image not found.' })
  @UseInterceptors(new TransformerInterceptor(Image))
  @Get('/:id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.imagesService.get(id);
  }
}
