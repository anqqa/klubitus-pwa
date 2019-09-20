import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { allow } from '../../users/user.entity';
import { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';

@Crud({
  model: { type: Favorite },
  query: {
    join: {
      event: {},
      user: { allow },
    },
    maxLimit: 500,
  },
  routes: {
    only: ['getManyBase'],
  },
})
@ApiUseTags('Events')
@Controller('events/favorites')
export class FavoritesController implements CrudController<Favorite> {
  constructor(readonly service: FavoritesService) {}

  get base(): CrudController<Favorite> {
    return this;
  }
}
