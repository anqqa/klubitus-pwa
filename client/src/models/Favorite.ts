import { BaseModel } from '@/models/BaseModel';
import Event from '@/models/Event';
import User from '@/models/User';

export default class Favorite extends BaseModel {
  event?: Event;
  user?: User;

  resource() {
    return 'events/favorites';
  }
}
