import { Controller, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudActions,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';

import { EntityForbiddenError } from '../common/errors/entityforbidden.error';
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
}
