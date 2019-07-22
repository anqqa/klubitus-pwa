import {
  ComparisonOperator,
  QueryFields,
  QueryJoin,
  RequestQueryBuilder,
} from '@nestjsx/crud-request';

RequestQueryBuilder.setOptions({
  paramNamesMap: {
    join: 'include',
    limit: 'limit',
  },
});

export class ModelQueryBuilder {
  // tslint:disable-next-line:variable-name
  private _builder: RequestQueryBuilder;

  constructor() {
    this._builder = RequestQueryBuilder.create();
  }

  embed(join: QueryJoin): this {
    this._builder.setJoin(join);

    return this;
  }

  filter(field: string, operator: ComparisonOperator, value?: any): this {
    this._builder.setFilter({ field, operator, value });

    return this;
  }

  filterOr(field: string, operator: ComparisonOperator, value?: any): this {
    this._builder.setOr({ field, operator, value });

    return this;
  }

  limit(limit: number): this {
    this._builder.setLimit(limit);

    return this;
  }

  offset(offset: number): this {
    this._builder.setOffset(offset);

    return this;
  }

  page(page: number): this {
    this._builder.setPage(page);

    return this;
  }

  query(): string {
    return this._builder.query().replace(/\[]/g, '');
  }

  select(fields: QueryFields): this {
    this._builder.select(fields);

    return this;
  }

  sort(field: string, order: 'ASC' | 'DESC' = 'ASC'): this {
    this._builder.sortBy({ field, order });

    return this;
  }
}
