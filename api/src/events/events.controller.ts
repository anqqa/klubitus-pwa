import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { DEvent, DEventsQuery } from './events.dto';
import { EventsService } from './events.service';

@ApiUseTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ title: 'Get multiple events' })
  @ApiOkResponse({ description: 'Return multiple events.', type: DEvent, isArray: true })
  @Get()
  async getAll(@Query() query: DEventsQuery): Promise<DEvent[]> {
    return await this.eventsService.findAll(query);
  }

  @ApiOperation({ title: 'Get single event' })
  @ApiOkResponse({ description: 'Return single event', type: DEvent })
  @ApiNotFoundResponse({ description: 'Event not found.' })
  @Get(':eventId')
  async getById(@Param('eventId') eventId: number | string): Promise<DEvent> {
    const id: number = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;

    return await this.eventsService.get(id);
  }
}
