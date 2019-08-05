// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';
import ForumPost from '@/models/ForumPost';

export default class ForumTopic extends BaseModel {
  area?: any;
  author?: any;
  author_name?: string;
  first_post_id?: number;
  id?: number;
  last_post?: any;
  last_post_at?: string;
  last_post_id?: number;
  name?: string;
  post_count?: number;
  read_count?: number;

  resource() {
    return 'topics';
  }

  posts(): ForumPost {
    return this.hasMany(ForumPost);
  }
}
