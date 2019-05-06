import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { GalleriesQuery, Gallery } from './galleries.dto';

import { GalleriesService } from './galleries.service';

@ApiUseTags('Images')
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @ApiOperation({ title: 'List galleries' })
  @ApiOkResponse({ description: 'Success', type: Gallery, isArray: true })
  @Get()
  async getAll(@Query() query: GalleriesQuery): Promise<Gallery[]> {
    return await this.galleriesService.findAll(query);
  }
}
