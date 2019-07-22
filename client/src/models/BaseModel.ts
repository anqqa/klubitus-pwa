import { NuxtAxiosInstance } from '@nuxtjs/axios';

import { ModelQueryBuilder } from '@/models/ModelQueryBuilder';

export class BaseModel extends ModelQueryBuilder {
  static $http: NuxtAxiosInstance;

  constructor(...attributes) {
    super();

    if (attributes.length > 0) {
      Object.assign(this, ...attributes);
    }
  }

  getPrimaryKey() {
    return this[this.primaryKey()];
  }

  primaryKey() {
    return 'id';
  }

  endpoint(): string {
    const endpoint = this.resource();
    const id = this.getPrimaryKey();

    return id ? `${endpoint}/${id}` : endpoint;
  }

  async get() {
    const query = this.query();
    const endpoint = this.endpoint();

    const data = await BaseModel.$http.$get(query ? `${endpoint}?${query}` : endpoint);
    const collection = Array.isArray(data) ? data : [data];

    return collection.map(item => new this.constructor(item));
  }

  protected resource(): string {
    return `${this.constructor.name.toLowerCase()}s`;
  }
}