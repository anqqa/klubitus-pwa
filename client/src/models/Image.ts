// tslint:disable:variable-name
import { BaseModel } from '@/models/BaseModel';

export interface Tag {
  height: number;
  id: number | string;
  name: string;
  width: number;
  x: number;
  y: number;
}

export default class Image extends BaseModel {
  color?: string;
  comment_count?: number;
  comments?: any[];
  created_at?: string;
  description?: string;
  exif?: Record<string, string | number>;
  height?: number;
  id?: number;
  notes?: any[];
  tags?: Tag[];
  url?: string;
  view_count?: number;
  width?: number;

  // resource() {
  //   return 'images';
  // }
}
