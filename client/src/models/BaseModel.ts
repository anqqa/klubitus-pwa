// tslint:disable:variable-name
import { NuxtAxiosInstance } from '@nuxtjs/axios';

import { ModelQueryBuilder } from '@/models/ModelQueryBuilder';

export class BaseModel extends ModelQueryBuilder {
  static $http: NuxtAxiosInstance;

  created_at?: string;
  id?: number | string;

  // tslint:disable-next-line:variable-name
  private _parentEndpoint?: string;

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

  async find(identifier: number | string): Promise<this> {
    this.id = identifier;

    return this.first();
  }

  async first(): Promise<this> {
    return (await this.get())[0];
  }

  endpoint(): string {
    const endpoint = this.resource();
    const id = this.getPrimaryKey();

    if (this._parentEndpoint) {
      return id
        ? `${this._parentEndpoint}/${endpoint}/${id}`
        : `${this._parentEndpoint}/${endpoint}`;
    }

    return id ? `${endpoint}/${id}` : endpoint;
  }

  async get(extraParams?: Record<string, string>): Promise<this[]> {
    const query = this.query(extraParams);
    const endpoint = this.endpoint();

    const data = await BaseModel.$http.$get(query ? `${endpoint}?${query}` : endpoint);
    const collection = Array.isArray(data) ? data : [data];

    return this.parseCollection(collection);
  }

  hasMany<T extends typeof BaseModel>(model: T): InstanceType<T> {
    const instance = new model() as InstanceType<T>;
    const endpoint = this.endpoint();

    instance._parent(endpoint);

    return instance;
  }

  _parent(endpoint: string) {
    this._parentEndpoint = endpoint;
  }

  protected parseCollection(collection: any[]): this[] {
    // @ts-ignore
    return collection.map(item => new this.constructor(item));
  }

  protected resource(): string {
    return `${this.constructor.name.toLowerCase()}s`;
  }
}
