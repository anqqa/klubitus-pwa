import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../common/basecrud.service';
import { Pagination } from '../common/pagination/pagination.dto';
import { PaginationService } from '../common/pagination/pagination.service';
import { Event } from '../events';
import { Stats } from './galleries.dto';
import { Gallery } from './gallery.entity';
import { GalleryImage } from './images';

@Injectable()
export class GalleriesService extends BaseCrudService<Gallery> {
  constructor(
    @InjectRepository(Gallery) repo: Repository<Gallery>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(GalleryImage) private imageRepository: Repository<GalleryImage>
  ) {
    super(repo);
  }

  async getImage(id: number, imageId: number): Promise<GalleryImage> {
    return this.imageRepository
      .createQueryBuilder('image')
      .innerJoin('galleries_images', 'gallery', 'gallery.image_id = image.id')
      .leftJoinAndSelect('image.author', 'author')
      .where('gallery.gallery_id = :id', { id })
      .andWhere('image.id = :imageId', { imageId })
      .getOne();
  }

  async getImages(id: number, query?: Pagination): Promise<GalleryImage[]> {
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
