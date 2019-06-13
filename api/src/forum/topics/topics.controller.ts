import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';
import { Topic, TopicsQuery } from './topics.dto';
import { TopicsService } from './topics.service';

@ApiUseTags('Forum')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiOperation({ title: 'List topics' })
  @ApiOkResponse({ type: Topic, isArray: true })
  @ApiNotFoundResponse({ description: 'Topics not found.' })
  @UseInterceptors(new TransformerInterceptor(Topic))
  @Get()
  async getAll(@Query() query: TopicsQuery) {
    return await this.topicsService.findAll(query);
  }

  @ApiOperation({ title: 'Get a topic' })
  @ApiOkResponse({ type: Topic })
  @UseInterceptors(new TransformerInterceptor(Topic))
  @ApiNotFoundResponse({ description: 'Topic not found.' })
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.topicsService.get(id);
  }
}
