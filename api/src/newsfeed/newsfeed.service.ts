import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format, parse } from 'date-fns';
import { groupBy, values } from 'lodash';
import { getRepository, Repository } from 'typeorm';

import { PaginationService } from '../common/pagination/pagination.service';
import { Item, Relations } from './items/item.entity';
import { DATE_FORMATS } from './newsfeed.constants';
import { NewsfeedQuery } from './newsfeed.dto';

@Injectable()
export class NewsfeedService {
  constructor(@InjectRepository(Item) private readonly itemRepository: Repository<Item>) {}

  aggregate(items: Item[], datePart: string = 'day'): Item[][] {
    const dateFormat = DATE_FORMATS[datePart];

    // Group by user's action type per day
    const grouped = groupBy(
      items,
      item =>
        `${item.user_id}:${format(parse(item.created_at), dateFormat)}-${item.class}.${item.type}`,
    );

    // Return as array of arrays
    return values(grouped);
  }

  async fillRelations(items: Item[]): Promise<void> {
    // Build a list of related entity ids
    const relatedIds: Record<string, { entity: any; ids: number[] }> = {};

    items.forEach((item: any) => {
      for (const [target, [entity, alias]] of Object.entries(Relations)) {
        const id = item[`${target}_id`];

        if (id) {
          if (!relatedIds[alias]) {
            relatedIds[alias] = { entity, ids: [] };
          }

          relatedIds[alias].ids.push(id);
        }
      }
    });

    // Fetch those entities
    const entities: Record<string, any[]> = {};

    for (const [alias, { entity, ids }] of Object.entries(relatedIds)) {
      entities[alias] = await getRepository(entity)
        .createQueryBuilder(alias)
        .where(`${alias}.id IN (:...ids)`, { ids })
        .getMany();
    }

    // Populate parents
    items.forEach((item: any) => {
      for (const [target, [entity, alias]] of Object.entries(Relations)) {
        const targetId = item[`${target}_id`];

        if (targetId && entities[alias]) {
          item[target] = entities[alias].find(e => e.id === targetId);
        }
      }
    });
  }

  async findAll(query: NewsfeedQuery, datePart = 'day'): Promise<Item[]> {
    const { take, skip } = PaginationService.parseQuery(query, 100, 100);

    // Item ids, aggregate similar events per user daily
    const groupedQuery = await this.itemRepository
      .createQueryBuilder()
      .select('ARRAY_AGG(id)', 'ids')
      .addSelect(`DATE_TRUNC('${datePart}', created_at)`)
      .groupBy('user_id')
      .addGroupBy('class')
      .addGroupBy('type')
      .addGroupBy('2')
      .orderBy('2', 'DESC')
      .take(take)
      .skip(skip);

    // Fetch all items, can be more than requested limit if aggregating
    const itemQuery = this.itemRepository
      .createQueryBuilder('item')
      .select('item')
      // .leftJoinAndSelect('item.target_event', 'target_event')
      // .leftJoinAndSelect('item.target_forum_post', 'target_post')
      // .leftJoinAndSelect('item.target_forum_topic', 'target_topic')
      // .leftJoinAndSelect('item.target_gallery', 'target_gallery')
      // .leftJoinAndSelect('item.target_image', 'target_image')
      // .leftJoinAndSelect('item.target_user', 'target_user')
      // .leftJoinAndSelect('item.user', 'user')
      .where(qb => {
        const subquery = qb
          .subQuery()
          .select('UNNEST(grouped.ids)')
          .from('(' + groupedQuery.getQuery() + ')', 'grouped');

        return 'item.id IN ' + subquery.getQuery();
      })
      .orderBy('item.id', 'DESC');

    return await itemQuery.getMany();
  }
}