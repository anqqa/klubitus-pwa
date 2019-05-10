// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';
import { Image } from '../image.entity';

@Entity('image_notes')
export class Note {
  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User | null;

  @Column({ nullable: true })
  author_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  height: number | null;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Image)
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @Column()
  image_id: number;

  @Column()
  name: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ nullable: true })
  user_id: number | null;

  @Column({ nullable: true })
  width: number | null;

  @Column({ nullable: true })
  x: number | null;

  @Column({ nullable: true })
  y: number | null;
}
