// tslint:disable:variable-name
import { RawLocation } from 'vue-router';

import Image from '@/models/Image';
import { slug } from '@/utils/text';
import { BaseModel } from './BaseModel';

export default class Event extends BaseModel {
  begins_at?: string;
  city_name?: string;
  ends_at?: string;
  info?: string;
  name?: string;
  venue_name?: string;

  images() {
    return this.hasMany(Image);
  }

  get path(): RawLocation {
    return {
      name: 'events-id',
      params: { id: `${this.id}-${slug(this.name)}` },
    };
  }
}
