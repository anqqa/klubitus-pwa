import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './event.entity';
import { DEventsQuery } from './events.dto';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  async findAll(query: DEventsQuery): Promise<Event[]> {
    let order: Record<string, string> = { id: 'DESC' };

    // Order
    if ('sort' in query) {
      const direction = query.sort[0] === '-' ? 'DESC' : 'ASC';

      order = { [query.sort.replace(/[-+]/g, '')]: direction };
    }

    // Pagination
    const take = Math.max(1, Math.min(query.limit || 25, 500));

    return await this.eventRepository.find({ order, take });
  }

  async get(eventId: number): Promise<Event> {
    return await this.eventRepository.findOneOrFail(eventId);
  }
}
