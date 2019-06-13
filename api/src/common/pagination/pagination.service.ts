import { ConflictException, Injectable } from '@nestjs/common';
import { Pagination } from './pagination.dto';

@Injectable()
export class PaginationService {
  public static parseQuery(
    query?: Pagination,
    defaultLimit?: number,
    maxLimit?: number,
    minLimit: number = 1,
  ): { skip?: number; take?: number } {
    if (!query) {
      return {};
    }

    let skip: number;
    let take: number = defaultLimit;

    if ('limit' in query) {
      take = query.limit;

      if (minLimit !== undefined) {
        take = Math.max(take, minLimit);
      }

      if (maxLimit !== undefined) {
        take = Math.min(take, maxLimit);
      }
    }

    if ('page' in query) {
      if (!take) {
        throw new ConflictException('Pagination requires limit if page given');
      }

      skip = (query.page - 1) * take;
    }

    if ('offset' in query) {
      if (!take) {
        throw new ConflictException('Pagination requires limit if offset given');
      }

      skip = skip ? skip + query.offset : query.offset;
    }

    return { skip, take };
  }
}
