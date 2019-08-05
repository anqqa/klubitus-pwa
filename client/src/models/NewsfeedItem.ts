// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';

export default class NewsfeedItem extends BaseModel {
  class?: string;
  target_blog_entry?: any;
  target_event?: any;
  target_forum_topic?: any;
  target_track?: any;
  target_user?: any;
  target_venue?: any;
  type?: string;
  user?: any;

  resource() {
    return 'newsfeed';
  }

  /**
   * Newsfeed items are returned as list of list of items.
   */
  protected parseCollection(collection: any[]): this[] {
    return collection.map(subCollection => subCollection.map(item => new NewsfeedItem(item)));
  }
}
