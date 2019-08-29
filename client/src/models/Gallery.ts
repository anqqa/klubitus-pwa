// tslint:disable:variable-name
import { BaseModel } from './BaseModel';
import Event from './Event';
import Image from './Image';

export default class Gallery extends BaseModel {
  default_image?: Image;
  default_image_id?: number;
  event?: Event;
  event_date?: string;
  name?: string;

  resource() {
    return 'galleries';
  }

  images() {
    return this.hasMany(Image);
  }
}
