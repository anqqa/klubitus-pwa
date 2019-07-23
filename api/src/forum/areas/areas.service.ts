import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../../common/basecrud.service';
import { Area } from './area.entity';
import { AreasQuery } from './areas.dto';

@Injectable()
export class AreasService extends BaseCrudService<Area> {
  constructor(@InjectRepository(Area) repo: Repository<Area>) {
    super(repo);
  }

  async findAll(query?: AreasQuery): Promise<Area[]> {
    const relations =
      query && query.details
        ? ['last_topic', 'last_topic.author', 'last_topic.last_post', 'last_topic.last_post.author']
        : undefined;

    return await this.repo.find({
      order: { nest_left: 'ASC' },
      relations,
      where: { is_hidden: false },
    });
  }

  async get(areaId: number): Promise<Area> {
    return await this.repo.findOneOrFail(areaId);
  }

  async getAccessibleIds(): Promise<number[]> {
    return (await this.repo.find({
      select: ['id'],
      where: { is_hidden: false, is_private: false },
    })).map(({ id }) => id);
  }
}
