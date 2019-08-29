import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../common/basecrud.service';
import { Event } from './event.entity';

@Injectable()
export class EventsService extends BaseCrudService<Event> {
  constructor(@InjectRepository(Event) repo: Repository<Event>) {
    super(repo);
  }

  async get(eventId: number): Promise<Event> {
    return this.repo.findOneOrFail(eventId);
  }
}
