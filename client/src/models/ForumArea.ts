// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';

export default class ForumArea extends BaseModel {
  description?: string;
  id?: number;
  is_private?: boolean;
  name?: string;
  nest_depth?: number;
  topic_count?: number;

  resource() {
    return 'areas';
  }

  async getAll(withDetails?: boolean): Promise<ForumArea[]> {
    if (withDetails) {
      this.relation('last_topic');
      this.relation('last_topic.author');
      this.relation('last_topic.last_post');
      this.relation('last_topic.last_post.author');
    }

    return this.sort('nest_left', 'ASC').get();
  }
}
