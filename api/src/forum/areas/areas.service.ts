import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../../common/basecrud.service';
import { Area } from './area.entity';

@Injectable()
export class AreasService extends BaseCrudService<Area> {
  constructor(@InjectRepository(Area) repo: Repository<Area>) {
    super(repo);
  }

  async getAccessibleIds(): Promise<number[]> {
    return (await this.repo.find({
      select: ['id'],
      where: { is_hidden: false, is_private: false },
    })).map(({ id }) => id);
  }
}
