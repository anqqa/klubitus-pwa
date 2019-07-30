// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';

export default class Image extends BaseModel {
  color?: string;
  comment_count?: number;
  comments?: any[];
  created_at?: string;
  description?: string;
  exif?: any;
  height?: number;
  id?: number;
  notes?: any[];
  tags?: any[];
  url?: string;
  view_count?: number;
  width?: number;

  // resource() {
  //   return 'images';
  // }
}
