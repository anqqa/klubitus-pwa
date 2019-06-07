import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { Event, EventsQuery } from './events.dto';
import { EventsService } from './events.service';

@ApiUseTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ title: 'List events' })
  @ApiOkResponse({ description: 'Success', type: Event, isArray: true })
  @UseInterceptors(new TransformerInterceptor(Event))
  @Get()
  async getAll(@Query() query: EventsQuery) {
    return this.eventsService.findAll(query);
  }

  @ApiOperation({ title: 'Get an event' })
  @ApiOkResponse({ description: 'Success', type: Event })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @UseInterceptors(new TransformerInterceptor(Event))
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return this.eventsService.get(id);
  }
}
