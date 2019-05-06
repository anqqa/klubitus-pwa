// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Event } from '../../events/event.entity';

@Entity('galleries')
export class Gallery {
  @Column()
  copyright: string;

  @CreateDateColumn()
  created_at: Date;

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

  @Column()
  name: string;

  @UpdateDateColumn()
  updated_at: Date;
}
