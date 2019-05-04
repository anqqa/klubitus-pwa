import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { Area, AreasQuery } from './areas.dto';
import { AreasService } from './areas.service';

@ApiUseTags('Forum')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @ApiOperation({ title: 'List areas' })
  @ApiOkResponse({ description: 'Success', type: Area, isArray: true })
  @Get()
  async getAll(@Query() query: AreasQuery): Promise<Area[]> {
    return await this.areasService.findAll(query);
  }

  @ApiOperation({ title: 'Get an area' })
  @ApiOkResponse({ description: 'Success', type: Area })
  @ApiNotFoundResponse({ description: 'Area not found' })
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number): Promise<Area> {
    return await this.areasService.get(id);
  }
}
