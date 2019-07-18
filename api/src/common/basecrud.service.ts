import { QueryFilter } from '@nestjsx/crud-request';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ObjectLiteral } from 'typeorm';

export class BaseCrudService<T> extends TypeOrmCrudService<T> {
  protected mapOperatorsToQuery = (
    cond: QueryFilter,
    param: any
  ): { str: string; params: ObjectLiteral } => {
    const field = cond.field.indexOf('.') === -1 ? `${this.alias}.${cond.field}` : cond.field;

    let str: string;
    let params: ObjectLiteral;

    switch (cond.operator) {
      case 'starts':
        str = `LOWER(${field}) LIKE LOWER(:${param})`;
        params = { [param]: `${cond.value}%` };
        break;

      case 'ends':
        str = `LOWER(${field}) LIKE LOWER(:${param})`;
        params = { [param]: `%${cond.value}` };
        break;

      case 'cont':
        str = `LOWER(${field}) LIKE LOWER(:${param})`;
        params = { [param]: `%${cond.value}%` };
        break;

      case 'excl':
        str = `LOWER(${field}) NOT LIKE LOWER(:${param})`;
        params = { [param]: `%${cond.value}%` };
        break;

      default:
        return super.mapOperatorsToQuery(cond, param);
    }

    if (typeof params === 'undefined') {
      params = { [param]: cond.value };
    }

    return { str, params };
  };
}
