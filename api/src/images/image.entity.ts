// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../forum/users/user.entity';

@Entity('images')
export class Image {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author?: User;

  @Column({ nullable: true })
  author_id: number | null;

  @Column({ nullable: true })
  color: string | null;

  @Column()
  comment_count: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true, type: 'jsonb' })
  exif: Record<string, string | number> | null;

  @Column({ nullable: true })
  height: number | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'jsonb' })
  labels: object | null;

  @Column({ nullable: true })
  mime_type: string | null;

  @Column({ nullable: true })
  path: string | null;

  @Column({ nullable: true })
  postfix: string | null;

  @Column({ nullable: true, type: 'uuid' })
  uuid: string | null;

  @Column()
  view_count: number;

  @Column({ nullable: true })
  width: number | null;
}
