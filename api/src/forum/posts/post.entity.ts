// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Area } from '../areas/area.entity';
import { Topic } from '../topics/topic.entity';
import { User } from '../users/user.entity';

@Entity('forum_posts')
export class Post {
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
  forum_area_id: number;

  @Column()
  forum_topic_id: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parent_id: number;

  @Column()
  post: string;

  @ManyToOne(() => Topic, topic => topic.posts)
  @JoinColumn({ name: 'forum_topic_id' })
  topic: Topic;

  @UpdateDateColumn()
  updated_at: Date;
}
