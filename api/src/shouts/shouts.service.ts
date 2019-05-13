import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pagination } from '../common/pagination/pagination.dto';
import { PaginationService } from '../common/pagination/pagination.service';
import { Shout } from './shout.entity';

@Injectable()
export class ShoutsService {
  constructor(@InjectRepository(Shout) private readonly shoutRepository: Repository<Shout>) {}

  async findAll(query: Pagination): Promise<Shout[]> {
    const { take, skip } = PaginationService.parseQuery(query, 100, 100);

    return await this.shoutRepository.find({
      order: { id: 'DESC' },
      relations: ['author'],
      skip,
      take,
    });
  }
}
