import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { Area } from './area.entity';
import { AreasService } from './areas.service';

@Crud({
  model: { type: Area },
  query: {
    filter: [{ field: 'is_hidden', operator: 'ne', value: true }],
    join: {
      last_topic: {},
      'last_topic.author': {
        allow: ['avatar_url', 'id', 'signature', 'title', 'username'],
      },
      'last_topic.last_post': {},
      // 'last_topic.last_post.author': {},
    },
  },
  routes: { only: ['getManyBase', 'getOneBase'] },
})
@ApiUseTags('Forum')
@Controller('areas')
export class AreasController implements CrudController<Area> {
  constructor(readonly service: AreasService) {}

  get base(): CrudController<Area> {
    return this;
  }
}
