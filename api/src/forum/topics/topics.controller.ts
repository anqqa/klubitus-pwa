import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { Topic, TopicsQuery } from './topics.dto';
import { TopicsService } from './topics.service';

@ApiUseTags('Forum')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiOperation({ title: 'List topics' })
  @ApiOkResponse({ type: Topic, isArray: true })
  @ApiNotFoundResponse({ description: 'Topics not found.' })
  @Get()
  async getAll(@Query() query: TopicsQuery): Promise<Topic[]> {
    return await this.topicsService.findAll(query);
  }

  @ApiOperation({ title: 'Get a topic' })
  @ApiOkResponse({ type: Topic })
  @ApiNotFoundResponse({ description: 'Topic not found.' })
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number): Promise<Topic> {
    return await this.topicsService.get(id);
  }
}
