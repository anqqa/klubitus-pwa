// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../forum/users/user.entity';
import { Comment } from './comments/comment.entity';
import { Note } from './notes/note.entity';

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

  @OneToMany(() => Comment, comment => comment.image)
  comments: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  description: string | null;

  @Column('jsonb', { nullable: true })
  exif: Record<string, string | number> | null;

  @Column({ nullable: true })
  file: string | null;

  @Column({ nullable: true })
  height: number | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb', { nullable: true })
  labels: Label[] | null;

  @Column({ nullable: true })
  mime_type: string | null;

  @OneToMany(() => Note, note => note.image)
  notes: Note[];

  @Column({ nullable: true })
  original_filename: string | null;

  @Column({ nullable: true })
  original_height: number | null;

  @Column({ nullable: true })
  original_size: number | null;

  @Column({ nullable: true })
  original_width: number | null;

  @Column({ nullable: true })
  path: string | null;

  @Column({ nullable: true })
  phash: string | null;

  @Column({ nullable: true })
  postfix: string | null;

  @Column('uuid', { nullable: true })
  uuid: string | null;

  @Column()
  view_count: number;

  @Column({ nullable: true })
  width: number | null;
}
