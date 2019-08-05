// tslint:disable:variable-name
import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { Area } from '../areas/area.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Entity('forum_topics')
export class Topic extends BaseEntity {
  @Type(() => Area)
  @ManyToOne(() => Area)
  @JoinColumn({ name: 'forum_area_id' })
  area: Area;

  @Type(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  author_name: string;

  @Column()
  first_post_id: number;

  @Column()
  forum_area_id: number;

  @Column({ nullable: true })
  is_locked: boolean | null;

  @Column({ nullable: true })
  is_sinking: boolean | null;

  @Column({ nullable: true })
  is_sticky: boolean | null;

  @Type(() => Post)
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
