import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PaginationService } from '../../common/pagination/pagination.service';
import { AreasService } from '../areas/areas.service';
import { Topic } from '../topics/topic.entity';
import { Post } from './post.entity';
import { PostsQuery } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(
    private areasService: AreasService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async findAll(query: PostsQuery): Promise<Post[]> {
    const areaIds: number[] = await this.areasService.getAccessibleIds();
    const topic = await this.topicRepository.findOneOrFail(query.topic_id);

    if (!areaIds.includes(topic.forum_area_id)) {
      throw new ForbiddenException();
    }

    // Pagination
    const { take, skip } = PaginationService.parseQuery(query, 20, 100);

    return await this.postRepository.find({
      order: { id: 'ASC' },
      relations: ['author'],
      skip,
      take,
      where: { forum_topic_id: topic.id },
    });
  }

  async get(topicId: number): Promise<Post> {
    return await this.postRepository.findOneOrFail(topicId);
  }
}
