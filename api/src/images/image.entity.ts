// tslint:disable:max-classes-per-file
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

interface Label {
  Confidence: number;
  Instances: object[];
  Name: string;
  Parents: Array<{ Name: string }>;
}

@Entity('images')
export class Image {
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User | null;

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

  @Column('jsonb', { nullable: true })
  exif: Record<string, string | number> | null;

  @Column({ nullable: true })
  height: number | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb', { nullable: true })
  labels: Label[] | null;

  @Column({ nullable: true })
  mime_type: string | null;

  @Column({ nullable: true })
  path: string | null;

  @Column({ nullable: true })
  postfix: string | null;

  @Column('uuid', { nullable: true })
  uuid: string | null;

  @Column()
  view_count: number;

  @Column({ nullable: true })
  width: number | null;
}