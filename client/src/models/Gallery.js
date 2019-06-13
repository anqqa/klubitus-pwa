import Image from './Image';
import Model from './Model';

export default class Gallery extends Model {
  resource() {
    return 'galleries';
  }

  images() {
    return this.hasMany(Image);
  }
}
