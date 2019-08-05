// tslint:disable:variable-name
import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base.entity';
import { Event } from '../events/event.entity';
import { GalleryImage } from './images/image.entity';

@Entity('galleries')
export class Gallery extends BaseEntity {
  @Column()
  copyright: string;

  @Type(() => GalleryImage)
  @OneToOne(() => GalleryImage)
  @JoinColumn({ name: 'default_image_id' })
  default_image?: GalleryImage;

  @Column({ nullable: true })
  default_image_id?: number;

  @Type(() => Event)
  @OneToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column('date')
  event_date: Date;

  @Column()
  event_id: number;

  @Column()
  image_count: number;

  @Type(() => GalleryImage)
  @ManyToMany(type => GalleryImage, image => image.gallery)
  @JoinTable({
    inverseJoinColumn: { name: 'image_id' },
    joinColumn: { name: 'gallery_id' },
    name: 'galleries_images',
  })
  images?: GalleryImage[];

  @Column()
  name: string;
}
