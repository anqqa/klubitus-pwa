import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Area } from './area.entity';

@Injectable()
export class AreasService {
  constructor(@InjectRepository(Area) private readonly areaRepository: Repository<Area>) {}

  async findAll(): Promise<Area[]> {
    return await this.areaRepository.find();
  }

  async get(areaId: number): Promise<Area> {
    return await this.areaRepository.findOneOrFail(areaId);
  }
}
