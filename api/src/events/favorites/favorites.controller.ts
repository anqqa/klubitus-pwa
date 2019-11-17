import { Controller, ForbiddenException, HttpStatus, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';
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
import { FastifyReply } from 'fastify';
import { QueryFailedError } from 'typeorm';

import { RequestUser } from '../../auth/requestuser.decorator';
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
@ApiUseTags('Events')
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
    //    @Response() res: FastifyReply<any>
  ) {
    const favorite = Favorite.fromData(Favorite, dto);

    if (!favorite.can(CrudActions.CreateOne, user.roles)) {
      throw new ForbiddenException();
    }

    try {
      return await this.base.createOneBase(req, dto);
    } catch (error) {
      // Return OK if already added to favorites
      if (
        error instanceof QueryFailedError &&
        (error as any).code === PG_UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return; // res.status(HttpStatus.OK).send();
      }

      throw error;
    }
  }

  @UseGuards(AuthGuard())
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @RequestUser() user: User) {
    const favorite = await this.service.getOne(req);

    if (!favorite.can(CrudActions.DeleteOne, user.roles)) {
      throw new ForbiddenException();
    }

    return await this.base.deleteOneBase(req);
  }
}
