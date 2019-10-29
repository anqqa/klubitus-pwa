import { Controller, HttpStatus, Response, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';
import {
  BaseRouteName,
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { FastifyReply } from 'fastify';
import { QueryFailedError } from 'typeorm';
import { InjectUserInterceptor } from '../../auth/injectuser.interceptor';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from '../../common/interceptors/errors.interceptor';

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
    only: ['createOneBase', 'deleteOne', 'getManyBase'] as BaseRouteName[],
  },
})
@ApiUseTags('Events')
@Controller('events/favorites')
export class FavoritesController implements CrudController<Favorite> {
  constructor(readonly service: FavoritesService) {}

  get base(): CrudController<Favorite> {
    return this;
  }

  @UseGuards(AuthGuard())
  @UseInterceptors(new InjectUserInterceptor())
  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Favorite,
    @Response() res: FastifyReply<any>
  ) {
    try {
      await this.base.createOneBase(req, dto);
    } catch (error) {
      // Return OK if already added to favorites
      if (
        error instanceof QueryFailedError &&
        (error as any).code === PG_UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return res.status(HttpStatus.OK).send();
      }

      throw error;
    }
  }

  @UseGuards(AuthGuard())
  @UseInterceptors(new InjectUserInterceptor())
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Response() res: FastifyReply<any>) {
    // @TODO
  }
}
