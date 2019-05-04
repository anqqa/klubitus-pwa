import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { PaginationService } from '../../common/pagination/pagination.service';
import { Area } from '../areas/area.entity';
import { AreasService } from '../areas/areas.service';
import { Topic } from './topic.entity';
import { TopicsQuery } from './topics.dto';

@Injectable()
export class TopicsService {
  constructor(
    private areasService: AreasService,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async findAll(query: TopicsQuery): Promise<Topic[]> {
    const areaIds: number[] = await this.areasService.getAccessibleIds();

    // Filter by area
    let areaFilter;
    if ('area_id' in query) {
      areaFilter = query.area_id;

      if (!areaIds.includes(areaFilter)) {
        throw new EntityNotFoundError(Area, areaFilter);
      }
    } else {
      areaFilter = In(areaIds);
    }

    // Pagination
    const { take, skip } = PaginationService.parseQuery(query, 20, 100);

    return await this.topicRepository.find({
      order: { last_post_at: 'DESC' },
      skip,
      take,
      where: { forum_area_id: areaFilter },
    });
  }

  async get(topicId: number): Promise<Topic> {
    return await this.topicRepository.findOneOrFail(topicId);
  }
}
