import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { DArea } from './areas.dto';
import { AreasService } from './areas.service';

@ApiUseTags('forum')
@Controller('forum/areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @ApiOperation({ title: 'Get all areas' })
  @ApiOkResponse({ description: 'Return multiple forum areas.', type: DArea, isArray: true })
  @Get()
  async getAll(): Promise<DArea[]> {
    return await this.areasService.findAll();
  }

  @ApiOperation({ title: 'Get single area' })
  @ApiOkResponse({ description: 'Return single forum area', type: DArea })
  @ApiNotFoundResponse({ description: 'Area not found.' })
  @Get(':areaId')
  async getById(@Param('areaId') areaId: number | string): Promise<DArea> {
    const id: number = typeof areaId === 'string' ? parseInt(areaId, 10) : areaId;

    return await this.areasService.get(id);
  }
}
