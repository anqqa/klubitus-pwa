// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';

export default class Image extends BaseModel {
  color?: string;
  comment_count?: number;
  id?: number;
  url?: string;

  // resource() {
  //   return 'images';
  // }
}
