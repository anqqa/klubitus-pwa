// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';

export default class ForumPost extends BaseModel {
  author?: any;
  author_name?: string;
  created_at?: string;
  id?: number;
  post?: string;
  updated_at?: string;

  resource() {
    return 'posts';
  }
}
