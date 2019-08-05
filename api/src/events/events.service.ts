import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format, parse } from 'date-fns';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../common/basecrud.service';
import { PaginationService } from '../common/pagination/pagination.service';
import { Event } from './event.entity';
import { EventsQuery } from './events.dto';

@Injectable()
export class EventsService extends BaseCrudService<Event> {
  constructor(@InjectRepository(Event) repo: Repository<Event>) {
    super(repo);
  }

  async findAll(query: EventsQuery): Promise<Event[]> {
    let enforceLimit = true;
    let qb = this.repo.createQueryBuilder().orderBy('id', 'DESC');

    // Filter by date
    const { from, to } = query;

    if (from && to) {
      // Load between dates
      const dateTo = format(parse(to), 'YYYY-MM-DD');
      const timeFrom = format(parse(from), 'YYYY-MM-DD [09:59]');

      enforceLimit = false;

      qb = qb
        .where('begins_at::DATE <= :dateTo', { dateTo })
        .andWhere('ends_at >= :timeFrom', { timeFrom });
    } else if (from) {
      // Load events from date
      const date = format(parse(from), 'YYYY-MM-DD');

      qb = qb.where('begins_at::DATE >= :date', { date });
    } else if (to) {
      // Load events up to date
      const date = format(parse(to), 'YYYY-MM-DD');

      qb = qb.where('begins_at::DATE <= :date', { date });
    }

    // Search
    if ('search' in query) {
      const like = '%' + query.search.trim() + '%';

      qb = qb.andWhere('LOWER(name) LIKE LOWER(:like)', { like });
    }

    // Order
    if ('sort' in query) {
      const direction = query.sort[0] === '-' ? 'DESC' : 'ASC';
      const orderBy = query.sort.replace(/[-+]/g, '');

      // Input should be sanitized before this
      qb = qb.orderBy(orderBy, direction);
    }

    // Pagination
    const { take } = PaginationService.parseQuery(query, enforceLimit ? 25 : 500, 500);

    return qb.take(take).getMany();
  }

  async get(eventId: number): Promise<Event> {
    return this.repo.findOneOrFail(eventId);
  }
}
