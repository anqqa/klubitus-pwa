// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { NuxtAxiosInstance } from '@nuxtjs/axios';

export class Builder {
  public appends: any[];
  public fields: Record<string, any>;
  public filters: Record<string, any>;
  public includes: any[];
  public limitValue: number | null;
  public model: Model;
  public pageValue: number | null;
  public payload: any;
  public sorts: any[];

  constructor(model: Model);

  public append(...args): Builder;
  public include(...args): Builder;
  public limit(value: number): Builder;
  public orderBy(...args): Builder;
  public page(value: number): Builder;
  public params(payload: any): Builder;
  public query(): any;
  public select(...fields): Builder;
  public where(key: string, value: any): Builder;
  public whereIn(key: string, array: any[]): Builder;
}

export class StaticModel {
  public static instance(): Model;

  public static append(...args): Model;
  public static custom(...args): Model;
  public static find(id: number): Promise<Model>;
  public static $find(id: number): Promise<Model>;
  public static first(): Promise<Model>;
  public static $first(): Promise<Model>;
  public static get(): Promise<Model[]>;
  public static $get(): Promise<Model[]>;
  public static include(...args): Model;
  public static limit(value: number): Model;
  public static orderBy(...args): Model;
  public static page(value: number): Model;
  public static params(payload: Record<string, any>): Model;
  public static select(...fields): Model;
  public static where(field: string, value: any): Model;
  public static whereIn(field: string, array: any[]): Model;
}

interface IParameterNames {
  append: string;
  fields: string;
  filter: string;
  include: string;
  limit: string;
  page: string;
  sort: string;
}

export abstract class Model extends StaticModel {
  [key: string]: any;

  public static $http: NuxtAxiosInstance;
  public _builder: Builder;

  protected constructor(...attributes);

  public attach(params: any): Promise<any>;
  public custom(...args): Model;
  public delete(): Promise<any>;
  public endpoint(): string;
  public first(): Promise<Model>;
  public $first(): Promise<Model>;
  public find(id: number): Promise<Model>;
  public $find(id: number): Promise<Model>;
  public for(...args): Model;
  public get(): Promise<Model[]>;
  public $get(): Promise<Model[]>;
  public hasId(): boolean;
  public hasMany(model: Model): Model;
  public include(...arsg): Model;
  public isValidId(id: any): boolean;
  public limit(value: number): Model;
  public orderBy(...args): Model;
  public page(value: number): Model;
  public parameterNames(): IParameterNames;
  public params(payload: Record<string, any>): Model;
  public primaryKey(): string;
  public getPrimaryKey(): string;
  public resource(): string;
  public save(): Promise<Model>;
  public select(...fields): Model;
  public sync(params: any): Promise<any>;
  public where(field: string, value: any): Model;
  public whereIn(field: string, array: any[]): Model;

  public abstract baseURL(): string;
  public abstract request(options: any): Promise<any>;
}
