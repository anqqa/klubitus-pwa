import { Controller, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { CrudController } from '@nestjsx/crud/lib/interfaces/crud-controller.interface';
import { plainToClass } from 'class-transformer';

import { Item } from './items/item.entity';
import { DATE_FORMATS } from './newsfeed.constants';
import { NewsfeedService } from './newsfeed.service';

@Crud({
  model: { type: Item },
  query: { maxLimit: 100 },
  routes: { only: ['getManyBase'] },
})
@ApiTags('Newsfeed')
@Controller('newsfeed')
export class NewsfeedController implements CrudController<Item> {
  constructor(readonly service: NewsfeedService) {}

  get base(): CrudController<Item> {
    return this;
  }

  @ApiOperation({ summary: 'Get news feed items aggregated user/timespan/action' })
  @ApiOkResponse({ description: 'List of list of items.', type: Item })
  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Query() query: any) {
    const aggregate = query && query.aggregate;
    const datePart = aggregate && Object.keys(DATE_FORMATS).includes(aggregate) ? aggregate : 'day';
    const items = await this.service.findAll(req, datePart);

    await this.service.fillRelations(items);

    // Aggregated transforms aren't supported, do it manually
    const aggregated = this.service.aggregate(items, datePart);

    return aggregated.map(data => plainToClass(Item, data));
  }
}
