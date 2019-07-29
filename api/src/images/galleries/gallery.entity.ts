// tslint:disable:variable-name
import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { Event } from '../../events';
import { Image } from '../image.entity';

@Entity('galleries')
export class Gallery extends BaseEntity {
  @Column()
  copyright: string;

  @Type(() => Image)
  @OneToOne(() => Image)
  @JoinColumn({ name: 'default_image_id' })
  default_image: Image;

  @Column({ nullable: true })
  default_image_id: number | null;

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

  @ManyToMany(() => Image)
  @JoinTable({
    inverseJoinColumn: { name: 'image_id' },
    joinColumn: { name: 'gallery_id' },
    name: 'galleries_images',
  })
  images: Image[];

  @Column()
  name: string;
}
