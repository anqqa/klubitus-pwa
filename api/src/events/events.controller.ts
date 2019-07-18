import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import {
  Crud,
  CrudActions,
  CrudController,
  CrudRequest,
  Feature,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { EntityForbiddenError } from '../common/errors/entityforbidden.error';

import { TransformerInterceptor } from '../common/interceptors/transformer.interceptor';
import { User } from '../users/user.entity';
import { Event } from './event.entity';
import { EventsService } from './events.service';

@Crud({
  model: { type: Event },
  query: { maxLimit: 500 },
})
@ApiUseTags('Events')
@Controller('events')
export class EventsController implements CrudController<Event> {
  constructor(readonly service: EventsService) {}

  get base(): CrudController<Event> {
    return this;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Req() { user }: any): Promise<void | Event> {
    const model = await this.service.getOne(req);

    if (!model.can(CrudActions.DeleteOne, user && user.roles)) {
      throw new EntityForbiddenError(model);
    }

    return this.base.deleteOneBase(req);
  }

  /*
    @ApiOperation({ title: 'List events' })
    @ApiOkResponse({ description: 'Success', type: Event, isArray: true })
    @UseInterceptors(new TransformerInterceptor(Event))
    @Get()
    async getAll(@Query() query: EventsQuery) {
      return this.service.findAll(query);
    }

    @ApiOperation({ title: 'Get an event' })
    @ApiOkResponse({ description: 'Success', type: Event })
    @ApiNotFoundResponse({ description: 'Event not found' })
    @UseInterceptors(new TransformerInterceptor(Event))
    @Get(':id')
    async getById(@Param('id', new ParseIntPipe()) id: number) {
      return this.service.get(id);
    }
  */
}
