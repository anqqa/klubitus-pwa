// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Event } from '../../events/event.entity';
import { Image } from '../image.entity';

@Entity('galleries')
export class Gallery {
  @Column()
  copyright: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Image)
  @JoinColumn({ name: 'default_image_id' })
  default_image: Image;

  @Column({ nullable: true })
  default_image_id: number | null;

  @OneToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column('date')
  event_date: Date;

  @Column()
  event_id: number;

  @PrimaryGeneratedColumn()
  id: number;

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

  @UpdateDateColumn()
  updated_at: Date;
}
