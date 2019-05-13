import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { Pagination } from '../common/pagination/pagination.dto';

import { Shout } from './shouts.dto';
import { ShoutsService } from './shouts.service';

@ApiUseTags('Shouts')
@Controller('shouts')
export class ShoutsController {
  constructor(private readonly shoutsService: ShoutsService) {}

  @ApiOperation({ title: 'Get shouts' })
  @ApiOkResponse({ type: Shout, isArray: true })
  @UseInterceptors(new TransformerInterceptor(Shout))
  @Get('/')
  async getAll(@Query() query: Pagination) {
    return await this.shoutsService.findAll(query);
  }
}
