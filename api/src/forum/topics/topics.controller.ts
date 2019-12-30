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
import { Topic } from './topic.entity';
import { TopicsService } from './topics.service';

@Crud({
  model: { type: Topic },
  query: {
    join: {
      area: { allow: ['id', 'name'] },
      author: { allow: ['avatar_url', 'id', 'signature', 'title', 'username'] },
    },
    maxLimit: 500,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiTags('Forum')
@Controller('topics')
export class TopicsController implements CrudController<Topic> {
  constructor(readonly service: TopicsService, readonly areasService: AreasService) {}

  get base(): CrudController<Topic> {
    return this;
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest
  ): Promise<GetManyDefaultResponse<Topic> | Topic[]> {
    const accessibleAreaIds = await this.areasService.getAccessibleIds();

    req.parsed.filter.push({ field: 'forum_area_id', operator: 'in', value: accessibleAreaIds });

    return this.base.getManyBase(req);
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest): Promise<Topic> {
    const accessibleAreaIds = await this.areasService.getAccessibleIds();

    req.parsed.filter.push({ field: 'forum_area_id', operator: 'in', value: accessibleAreaIds });

    return this.base.getOneBase(req);
  }
}
