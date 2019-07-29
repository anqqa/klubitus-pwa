// tslint:disable:variable-name
import { BaseModel } from './BaseModel';

export default class Event extends BaseModel {
  begins_at?: string;
  name?: string;

  // resource() {
  //   return 'events';
  // }
}
