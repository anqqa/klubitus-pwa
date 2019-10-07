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

  async delete() {
    return await BaseModel.$http.$delete(this._url(this.data()));
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

  async find(identifier: number | string): Promise<this> {
    this.id = identifier;

    return this.first();
  }

  async first(): Promise<this> {
    return (await this.get())[0];
  }

  async get(extraParams?: Record<string, string>): Promise<this[]> {
    const data = await BaseModel.$http.$get(this._url(extraParams));
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

  async save(): Promise<this> {
    return this.id ? this._update() : this._create();
  }

  async _create(): Promise<this> {
    const data = await BaseModel.$http.$post(this._url(), this.data());

    // @ts-ignore
    return new this.constructor(data);
  }

  async _update(): Promise<this> {
    const data = await BaseModel.$http.$patch(this._url(), this.data());

    // @ts-ignore
    return new this.constructor(data);
  }

  _url(extraParams?: Record<string, string>): string {
    const query = this.query(extraParams);
    const endpoint = this.endpoint();

    return query ? `${endpoint}?${query}` : endpoint;
  }

  protected data(): Record<string, any> {
    const data = {};

    Object.entries(this).forEach(([key, value]) => {
      console.log({ key, value });

      if (!key.startsWith('_')) {
        data[key] = value;
      }
    });

    console.log({ data });

    return data;
  }

  protected parseCollection(collection: any[]): this[] {
    // @ts-ignore
    return collection.map(item => new this.constructor(item));
  }

  protected resource(): string {
    return `${this.constructor.name.toLowerCase()}s`;
  }
}
