import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';
import { Area, AreasQuery } from './areas.dto';
import { AreasService } from './areas.service';

@ApiUseTags('Forum')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @ApiOperation({ title: 'List areas' })
  @ApiOkResponse({ description: 'Success', type: Area, isArray: true })
  @UseInterceptors(new TransformerInterceptor(Area))
  @Get()
  async getAll(@Query() query: AreasQuery) {
    return await this.areasService.findAll(query);
  }

  @ApiOperation({ title: 'Get an area' })
  @ApiOkResponse({ description: 'Success', type: Area })
  @ApiNotFoundResponse({ description: 'Area not found' })
  @UseInterceptors(new TransformerInterceptor(Area))
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.areasService.get(id);
  }
}
