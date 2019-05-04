import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format, parse } from 'date-fns';
import { MoreThanOrEqual, Raw, Repository } from 'typeorm';

import { PaginationService } from '../common/pagination/pagination.service';
import { Event } from './event.entity';
import { EventsQuery } from './events.dto';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  async findAll(query: EventsQuery): Promise<Event[]> {
    let where;
    let enforceLimit = true;
    let order: Record<string, string> = { id: 'DESC' };

    // Filter by date
    const { from, to } = query;

    if (from && to) {
      // Load between dates
      enforceLimit = false;
      where = {
        begins_at: Raw(() => `begins_at::DATE <= '${format(parse(to), 'YYYY-MM-DD')}'`),
        ends_at: MoreThanOrEqual(format(parse(from), 'YYYY-MM-DD [09:59]')),
      };
    } else if (from) {
      // Load events from date
      where = {
        begins_at: Raw(() => `begins_at::DATE >= '${format(parse(from), 'YYYY-MM-DD')}'`),
      };
    } else if (to) {
      // Load events up to date
      where = {
        begins_at: Raw(() => `begins_at::DATE <= '${format(parse(to), 'YYYY-MM-DD')}'`),
      };
    }

    // Order
    if ('sort' in query) {
      const direction = query.sort[0] === '-' ? 'DESC' : 'ASC';

      order = { [query.sort.replace(/[-+]/g, '')]: direction };
    }

    // Pagination
    const { take } = PaginationService.parseQuery(query, enforceLimit ? 25 : 500, 500);

    return await this.eventRepository.find({ where, order, take });
  }

  async get(eventId: number): Promise<Event> {
    return await this.eventRepository.findOneOrFail(eventId);
  }
}
