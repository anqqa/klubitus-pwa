// tslint:disable:variable-name
import { RawLocation } from 'vue-router';

import Image from '@/models/Image';
import { slug } from '@/utils/text';
import { avatarUrl } from '@/utils/url';
import { BaseModel } from './BaseModel';

export default class User extends BaseModel {
  avatar_url?: string;
  username?: string;

  images() {
    return this.hasMany(Image);
  }

  get avatar(): string | undefined {
    return this.avatar_url && avatarUrl(this.avatar_url);
  }

  get path(): RawLocation {
    return {
      name: 'users-id',
      params: { id: `${this.id!}-${slug(this.username!)}` },
    };
  }
}
