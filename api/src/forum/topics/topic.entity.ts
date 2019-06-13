// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Area } from '../areas/area.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Entity('forum_topics')
export class Topic {
  @ManyToOne(() => Area)
  @JoinColumn({ name: 'forum_area_id' })
  area: Area;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  author_name: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  first_post_id: number;

  @Column()
  forum_area_id: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  is_locked: boolean | null;

  @Column({ nullable: true })
  is_sinking: boolean | null;

  @Column({ nullable: true })
  is_sticky: boolean | null;

  @OneToOne(() => Post)
  @JoinColumn({ name: 'last_post_id' })
  last_post: Post;

  @Column('timestamp')
  last_post_at: Date;

  @Column()
  last_post_id: number;

  @Column()
  name: string;

  @Column()
  post_count: number;

  @OneToMany(() => Post, post => post.topic)
  posts: Post[];

  @Column()
  read_count: number;
}
