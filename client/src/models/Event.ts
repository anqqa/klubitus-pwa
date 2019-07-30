// tslint:disable:variable-name
import { BaseModel } from './BaseModel';

export default class Event extends BaseModel {
  begins_at?: string;
  city_name?: string;
  name?: string;
  venue_name?: string;

  // resource() {
  //   return 'events';
  // }
}
