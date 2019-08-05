import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../../common/basecrud.service';
import { Topic } from './topic.entity';

@Injectable()
export class TopicsService extends BaseCrudService<Topic> {
  constructor(@InjectRepository(Topic) repo: Repository<Topic>) {
    super(repo);
  }
}
