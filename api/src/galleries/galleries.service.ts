import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../common/basecrud.service';
import { Event } from '../events/event.entity';
import { Stats } from './galleries.dto';
import { Gallery } from './gallery.entity';

@Injectable()
export class GalleriesService extends BaseCrudService<Gallery> {
  constructor(
    @InjectRepository(Gallery) repo: Repository<Gallery>,
    @InjectRepository(Event) readonly eventRepository: Repository<Event>
  ) {
    super(repo);
  }

  async getOrCreateByEvent(id?: number, eventId?: number): Promise<Gallery> {
    if (id) {
      return this.repo.findOneOrFail(id);
    }

    if (eventId) {
      try {
        return await this.repo.findOneOrFail({ event_id: eventId });
      } catch (error) {
        const event = await this.eventRepository.findOneOrFail(eventId);

        return this.repo.create({
          event_date: event.begins_at,
          event_id: event.id,
          name: event.name,
        });
      }
    }

    throw new Error('Gallery or event ID required');
  }

  async getStats(): Promise<Stats[]> {
    return this.repo
      .createQueryBuilder('gallery')
      .select('EXTRACT (YEAR FROM event_date)', 'year')
      .addSelect('EXTRACT (MONTH FROM event_date)', 'month')
      .addSelect('COUNT(id)', 'gallery_count')
      .addSelect('SUM(image_count)', 'image_count')
      .where('image_count > 0')
      .groupBy('year')
      .addGroupBy('month')
      .orderBy('year', 'DESC')
      .addOrderBy('month', 'DESC')
      .getRawMany();
  }
}
