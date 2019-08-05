import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../../common/basecrud.service';
import { Post } from './post.entity';

@Injectable()
export class PostsService extends BaseCrudService<Post> {
  constructor(@InjectRepository(Post) repo: Repository<Post>) {
    super(repo);
  }
}
