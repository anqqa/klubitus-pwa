import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format, parse } from 'date-fns';
import { Between, MoreThan, Repository } from 'typeorm';
import { PaginationService } from '../../common/pagination/pagination.service';

import { GalleriesQuery } from './galleries.dto';
import { Gallery } from './gallery.entity';

@Injectable()
export class GalleriesService {
  constructor(@InjectRepository(Gallery) private readonly galleryRepository: Repository<Gallery>) {}

  async findAll(query: GalleriesQuery): Promise<Gallery[]> {
    const { event_id, from, to } = query;
    const relations = ['event'];
    let order: Record<string, string> = { updated_at: 'DESC' };
    let where = {};

    if (event_id) {
      where = { event_id };
    } else if (from && to) {
      // If date range is given then order by event date, otherwise updated date
      const dateFrom = parse(from);
      const dateTo = parse(to);

      where = {
        event_date: Between(format(dateFrom, 'YYYY-MM-DD'), format(dateTo, 'YYYY-MM-DD')),
        image_count: MoreThan(0),
      };
      order = { event_date: 'DESC', updated_at: 'DESC' };
    }

    // Pagination
    const { take, skip } = PaginationService.parseQuery(query, 100, 100);

    return await this.galleryRepository.find({ order, relations, skip, take, where });
  }
}
