import { Controller, ForbiddenException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {
  BaseRouteName,
  Crud,
  CrudActions,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { QueryFailedError } from 'typeorm';

import { RequestUser } from '../../common/decorators';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from '../../common/interceptors/errors.interceptor';
import { allow, User } from '../../users/user.entity';
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
    only: ['createOneBase', 'deleteOneBase', 'getManyBase'] as BaseRouteName[],
  },
})
@ApiTags('Events')
@Controller('favorites')
export class FavoritesController implements CrudController<Favorite> {
  constructor(readonly service: FavoritesService) {}

  get base(): CrudController<Favorite> {
    return this;
  }

  @UseGuards(AuthGuard())
  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Favorite,
    @RequestUser() user: User
  ) {
    const favorite = Favorite.fromData(Favorite, dto);

    if (!favorite.allows(CrudActions.CreateOne, user.roles)) {
      throw new ForbiddenException();
    }

    try {
      return await this.base.createOneBase(req, dto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === PG_UNIQUE_CONSTRAINT_VIOLATION
      ) {
        const { event_id, user_id } = favorite;

        return this.service.findOne({ where: { event_id, user_id } });
      }

      throw error;
    }
  }

  @UseGuards(AuthGuard())
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @RequestUser() user: User) {
    const favorite = await this.service.getOne(req);

    if (!favorite.allows(CrudActions.DeleteOne, user.roles)) {
      throw new ForbiddenException();
    }

    return await this.base.deleteOneBase(req);
  }
}
