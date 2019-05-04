import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Topic } from './topic.entity';
import { TopicsQuery } from './topics.dto';

@Injectable()
export class TopicsService {
  constructor(@InjectRepository(Topic) private readonly topicRepository: Repository<Topic>) {}

  async findAll(query: TopicsQuery): Promise<Topic[]> {
    // Filter by area
    if ('area_id' in query) {
    }

    return await this.topicRepository.find({ take: 10 });
  }

  async get(topicId: number): Promise<Topic> {
    return await this.topicRepository.findOneOrFail(topicId);
  }
}
