// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';
import Event from '@/models/Event';
import User from '@/models/User';

export default class Favorite extends BaseModel {
  event?: Event;
  event_id?: number;
  user?: User;
  user_id?: number;

  resource() {
    return 'events/favorites';
  }
}
