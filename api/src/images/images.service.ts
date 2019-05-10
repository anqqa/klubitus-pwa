import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Image) private readonly imageRepository: Repository<Image>) {}

  async get(id: number): Promise<Image> {
    return await this.imageRepository.findOneOrFail(id, { relations: ['author', 'notes'] });
  }
}
