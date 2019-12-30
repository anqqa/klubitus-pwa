import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';

import { AreasService } from '../areas/areas.service';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

@Crud({
  model: { type: Post },
  params: {
    id: { field: 'id', type: 'number', primary: true },
    topicId: { field: 'forum_topic_id', type: 'number' },
  },
  query: {
    join: {
      area: { allow: ['id', 'name'] },
      author: { allow: ['avatar_url', 'id', 'signature', 'title', 'username'] },
      topic: {},
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiTags('Forum')
@Controller('/topics/:topicId/posts')
export class PostsController implements CrudController<Post> {
  constructor(readonly service: PostsService, readonly areasService: AreasService) {}

  get base(): CrudController<Post> {
    return this;
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest): Promise<GetManyDefaultResponse<Post> | Post[]> {
    const accessibleAreaIds = await this.areasService.getAccessibleIds();

    req.parsed.filter.push({ field: 'forum_area_id', operator: 'in', value: accessibleAreaIds });

    return this.base.getManyBase(req);
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest): Promise<Post> {
    const accessibleAreaIds = await this.areasService.getAccessibleIds();

    req.parsed.filter.push({ field: 'forum_area_id', operator: 'in', value: accessibleAreaIds });

    return this.base.getOneBase(req);
  }
}
