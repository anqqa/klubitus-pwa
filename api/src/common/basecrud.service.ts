// tslint:disable:object-literal-sort-keys
import { JoinOptions } from '@nestjsx/crud';
import { QueryFilter, QueryJoin } from '@nestjsx/crud-request';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class BaseCrudService<T> extends TypeOrmCrudService<T> {
  public decidePagination(parsed: any, options: any): boolean {
    // Never return pagination data
    return false;
  }

  protected getJoinType = (relationType: string) => 'leftJoin';

  protected setJoin = (
    cond: QueryJoin,
    joinOptions: JoinOptions,
    builder: SelectQueryBuilder<T>
  ) => {
    if (this.entityRelationsHash[cond.field] === undefined && cond.field.includes('.')) {
      const curr = this.getRelationMetadata(cond.field);

      if (!curr) {
        this.entityRelationsHash[cond.field] = null;

        return true;
      }

      this.entityRelationsHash[cond.field] = {
        name: curr.nestedRelation, // Fixes duplicate table name with multiple same name relations
        // name: curr.propertyName,
        type: this.getJoinType(curr.relationType),
        columns: curr.inverseEntityMetadata.columns.map((col: any) => col.propertyName),
        referencedColumn: (curr.joinColumns.length
          ? curr.joinColumns[0]
          : curr.inverseRelation.joinColumns[0]
        ).referencedColumn.propertyName,
        nestedRelation: curr.nestedRelation,
      };
    }

    if (cond.field && this.entityRelationsHash[cond.field] && joinOptions[cond.field]) {
      const relation = this.entityRelationsHash[cond.field];
      const options = joinOptions[cond.field];
      const allowed = this.getAllowedColumns(relation.columns, options);

      if (!allowed.length) {
        return true;
      }

      const columns =
        !cond.select || !cond.select.length
          ? allowed
          : cond.select.filter(col => allowed.some((a: any) => a === col));

      const select = [
        relation.referencedColumn,
        ...(options.persist && options.persist.length ? options.persist : []),
        ...columns,
      ].map(col => `${relation.name}.${col}`);

      const relationPath = relation.nestedRelation || `${this.alias}.${relation.name}`;

      // @ts-ignore
      builder[relation.type](relationPath, relation.name);
      builder.addSelect(select);
    }

    return true;
  };

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
