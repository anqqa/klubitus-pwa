import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Area } from './area.entity';
import { AreasQuery } from './areas.dto';

@Injectable()
export class AreasService {
  constructor(@InjectRepository(Area) private readonly areaRepository: Repository<Area>) {}

  async findAll(query?: AreasQuery): Promise<Area[]> {
    const relations =
      query && query.details
        ? ['last_topic', 'last_topic.author', 'last_topic.last_post', 'last_topic.last_post.author']
        : undefined;

    return await this.areaRepository.find({
      order: { nest_left: 'ASC' },
      relations,
      where: { is_hidden: false },
    });
  }

  async get(areaId: number): Promise<Area> {
    return await this.areaRepository.findOneOrFail(areaId);
  }

  async getAccessibleIds(): Promise<number[]> {
    return (await this.areaRepository.find({
      select: ['id'],
      where: { is_hidden: false, is_private: false },
    })).map(({ id }) => id);
  }
}
