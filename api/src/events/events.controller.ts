import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { Event, EventsQuery } from './events.dto';
import { EventsService } from './events.service';

@ApiUseTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ title: 'List events' })
  @ApiOkResponse({ description: 'Success', type: Event, isArray: true })
  @Get()
  async getAll(@Query() query: EventsQuery): Promise<Event[]> {
    return await this.eventsService.findAll(query);
  }

  @ApiOperation({ title: 'Get an event' })
  @ApiOkResponse({ description: 'Success', type: Event })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number): Promise<Event> {
    return await this.eventsService.get(id);
  }
}
