import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { Item } from './items/items.dto';
import { DATE_FORMATS } from './newsfeed.constants';
import { NewsfeedQuery } from './newsfeed.dto';
import { NewsfeedService } from './newsfeed.service';

@ApiUseTags('Newsfeed')
@Controller('newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  @ApiOperation({ title: 'Get news feed items aggregated user/timespan/action' })
  @ApiOkResponse({ description: 'List of list of items.', type: Item })
  @Get('/')
  async getAll(@Query() query: NewsfeedQuery) {
    const { aggregate } = query;
    const datePart = aggregate && Object.keys(DATE_FORMATS).includes(aggregate) ? aggregate : 'day';
    const items = await this.newsfeedService.findAll(query, datePart);

    await this.newsfeedService.fillRelations(items);

    // Aggregated transforms aren't supported, do it manually
    const aggregated = this.newsfeedService.aggregate(items, datePart);

    return aggregated.map(data => plainToClass(Item, data));
  }
}
