import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../../common/basecrud.service';
import { GalleryImage } from './image.entity';

@Injectable()
export class GalleryImagesService extends BaseCrudService<GalleryImage> {
  constructor(@InjectRepository(GalleryImage) repo: Repository<GalleryImage>) {
    super(repo);
  }
}
