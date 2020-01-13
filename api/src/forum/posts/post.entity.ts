// tslint:disable:variable-name
import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { Area } from '../areas/area.entity';
import { Topic } from '../topics/topic.entity';
import { User } from '../users/user.entity';

@Entity('forum_posts')
export class Post extends BaseEntity {
  @Column()
  author_name: string;

  @Column()
  forum_area_id: number;

  @Column()
  forum_topic_id: number;

  @Column({ nullable: true })
  parent_id: number;

  @Column()
  post: string;

  /**
   * Relations
   */

  @Type(type => Area)
  @ManyToOne(type => Area)
  @JoinColumn({ name: 'forum_area_id' })
  area: Area;

  @Type(type => User)
  @ManyToOne(type => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Type(type => Topic)
  @ManyToOne(type => Topic, topic => topic.posts)
  @JoinColumn({ name: 'forum_topic_id' })
  topic: Topic;
}
