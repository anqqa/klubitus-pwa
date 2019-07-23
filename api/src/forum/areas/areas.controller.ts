import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { Area } from './area.entity';
import { AreasService } from './areas.service';

@Crud({
  model: { type: Area },
  query: { filter: [{ field: 'is_hidden', operator: 'eq', value: false }] },
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
