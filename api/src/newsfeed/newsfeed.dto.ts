// tslint:disable:max-classes-per-file
import { ApiModelPropertyOptional } from '@nestjs/swagger';

import { Pagination } from '../common/pagination/pagination.dto';
import { DATE_FORMATS } from './newsfeed.constants';

export class NewsfeedQuery extends Pagination {
  @ApiModelPropertyOptional({
    description: 'Aggregate items by timespan.',
    enum: Object.keys(DATE_FORMATS),
  })
  aggregate?: string;
}
