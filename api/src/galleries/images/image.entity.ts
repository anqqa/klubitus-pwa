import { Type } from 'class-transformer';
import { Entity, ManyToMany } from 'typeorm';

import { BaseImage } from '../../images/image.entity';
import { Gallery } from '../gallery.entity';

@Entity('images')
export class GalleryImage extends BaseImage {
  @Type(() => Gallery)
  @ManyToMany(type => Gallery, gallery => gallery.images)
  gallery: Gallery;
}
