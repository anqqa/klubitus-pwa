import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format, parse } from 'date-fns';
import { Between, MoreThan, Repository } from 'typeorm';
import { BaseCrudService } from '../../common/basecrud.service';

import { Pagination } from '../../common/pagination/pagination.dto';
import { PaginationService } from '../../common/pagination/pagination.service';
import { Event } from '../../events';
import { Image } from '../image.entity';
import { GalleriesQuery, Stats } from './galleries.dto';
import { Gallery } from './gallery.entity';

@Injectable()
export class GalleriesService extends BaseCrudService<Gallery> {
  constructor(
    @InjectRepository(Gallery) repo: Repository<Gallery>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Image) private imageRepository: Repository<Image>
  ) {
    super(repo);
  }

  async findAll(query: GalleriesQuery): Promise<Gallery[]> {
    const { event_id, from, to } = query;
    const relations = ['default_image', 'event'];
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

    return this.repo.find({ order, relations, skip, take, where });
  }

  async get(id: number): Promise<Gallery> {
    return this.repo.findOneOrFail(id, { relations: ['event'] });
  }

  async getImage(id: number, imageId: number): Promise<Image> {
    return this.imageRepository
      .createQueryBuilder('image')
      .innerJoin('galleries_images', 'gallery', 'gallery.image_id = image.id')
      .leftJoinAndSelect('image.author', 'author')
      .where('gallery.gallery_id = :id', { id })
      .andWhere('image.id = :imageId', { imageId })
      .getOne();
  }

  async getImages(id: number, query?: Pagination): Promise<Image[]> {
    // Pagination
    const { take, skip } = PaginationService.parseQuery(query, 100, 100);

    return this.imageRepository
      .createQueryBuilder('image')
      .innerJoin('galleries_images', 'gallery', 'gallery.image_id = image.id')
      .leftJoinAndSelect('image.author', 'author')
      .where('gallery.gallery_id = :id', { id })
      .orderBy('image.id', 'ASC')
      .take(take)
      .skip(skip)
      .getMany();
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
