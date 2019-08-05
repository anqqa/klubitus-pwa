import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { Shout } from './shout.entity';
import { ShoutsService } from './shouts.service';

@Crud({
  model: { type: Shout },
  query: {
    join: {
      author: { allow: ['avatar_url', 'id', 'signature', 'title', 'username'] },
    },
  },
  routes: {
    only: ['getManyBase'],
  },
})
@ApiUseTags('Shouts')
@Controller('shouts')
export class ShoutsController implements CrudController<Shout> {
  constructor(readonly service: ShoutsService) {}

  get base(): CrudController<Shout> {
    return this;
  }
}
