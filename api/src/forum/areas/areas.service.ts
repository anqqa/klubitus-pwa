import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Area } from './area.entity';
import { AreasQuery } from './areas.dto';

@Injectable()
export class AreasService {
  constructor(@InjectRepository(Area) private readonly areaRepository: Repository<Area>) {}

  async findAll(query?: AreasQuery): Promise<Area[]> {
    return await this.areaRepository.find({
      order: { nest_left: 'ASC' },
      where: { is_hidden: false },
    });
  }

  async get(areaId: number): Promise<Area> {
    return await this.areaRepository.findOneOrFail(areaId);
  }

  async getAccessibleIds(): Promise<number[]> {
    return (await this.areaRepository.find({
      select: ['id'],
      where: { is_hidden: false },
    })).map(({ id }) => id);
  }
}
