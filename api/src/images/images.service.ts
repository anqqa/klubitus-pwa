import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../common/basecrud.service';
import { Image } from './image.entity';

@Injectable()
export class ImagesService extends BaseCrudService<Image> {
  constructor(@InjectRepository(Image) repo: Repository<Image>) {
    super(repo);
  }

  // async get(id: number): Promise<Image> {
  //   return this.imageRepository.findOneOrFail(id, {
  //     relations: ['author', 'comments', 'comments.author', 'notes'],
  //   });
  // }
}
