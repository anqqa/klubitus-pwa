// tslint:disable:variable-name
import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { Topic } from '../topics/topic.entity';

@Entity('forum_areas')
export class Area extends BaseEntity {
  @Column({ nullable: true })
  description?: string;

  @Column()
  is_hidden: boolean;

  @Column()
  is_moderated: boolean;

  @Column()
  is_private: boolean;

  @Type(type => Topic)
  @OneToOne(() => Topic)
  @JoinColumn({ name: 'last_topic_id' })
  last_topic: Topic;

  @Column({ nullable: true })
  last_topic_id?: number;

  @Column()
  name: string;

  @Column()
  nest_depth: number;

  @Column()
  nest_left: number;

  @Column()
  nest_right: number;

  @Column({ nullable: true })
  parent_id?: number;

  @Column()
  post_count: number;

  @Column()
  topic_count: number;

  @OneToMany(() => Topic, topic => topic.area)
  topics: Topic[];
}
