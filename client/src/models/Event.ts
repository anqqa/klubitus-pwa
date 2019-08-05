// tslint:disable:variable-name
import Image from '@/models/Image';
import { BaseModel } from './BaseModel';

export default class Event extends BaseModel {
  begins_at?: string;
  city_name?: string;
  name?: string;
  venue_name?: string;

  images() {
    return this.hasMany(Image);
  }
  // resource() {
  //   return 'events';
  // }
}
