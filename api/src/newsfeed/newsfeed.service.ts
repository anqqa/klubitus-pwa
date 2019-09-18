import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { format } from 'date-fns';
import { groupBy, values } from 'lodash';
import { getRepository, Repository } from 'typeorm';
import { BaseCrudService } from '../common/basecrud.service';

import { Item, Relations } from './items/item.entity';
import { DATE_FORMATS } from './newsfeed.constants';

@Injectable()
export class NewsfeedService extends BaseCrudService<Item> {
  constructor(@InjectRepository(Item) repo: Repository<Item>) {
    super(repo);
  }

  aggregate(items: Item[], datePart: string = 'day'): Item[][] {
    const dateFormat = DATE_FORMATS[datePart];

    // Group by user's action type per day
    const grouped = groupBy(
      items,
      item => `${item.user_id}:${format(item.created_at, dateFormat)}-${item.class}.${item.type}`
    );

    // Return as array of arrays
    return values(grouped) as Item[][];
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

  async findAll(req: CrudRequest, datePart = 'day'): Promise<Item[]> {
    const { filter, limit, offset } = req.parsed;

    // Item ids, aggregate similar events per user daily
    const groupedQuery = await this.repo
      .createQueryBuilder()
      .select('ARRAY_AGG(id)', 'ids')
      .addSelect(`DATE_TRUNC('${datePart}', created_at)`)
      .groupBy('user_id')
      .addGroupBy('class')
      .addGroupBy('type')
      .addGroupBy('2')
      .orderBy('2', 'DESC')
      .take(limit)
      .skip(offset);

    if (filter && filter.length) {
      for (let i = 0; i < filter.length; i++) {
        // @ts-ignore
        this.setAndWhere(filter[i], i, groupedQuery);
      }
    }

    // Fetch all items, can be more than requested limit if aggregating
    const itemQuery = this.repo
      .createQueryBuilder('items')
      .select('items')
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
          .from('(' + groupedQuery.getQuery() + ')', 'grouped')
          .setParameters(groupedQuery.getParameters());

        return 'items.id IN ' + subquery.getQuery();
      })
      .orderBy('items.id', 'DESC');

    return await itemQuery.getMany();
  }
}
