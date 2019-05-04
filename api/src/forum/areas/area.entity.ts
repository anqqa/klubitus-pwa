// tslint:disable:variable-name
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Topic } from '../topics/topic.entity';

@Entity('forum_areas')
export class Area {
  @Column({ nullable: true })
  description: string | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_moderated: boolean;

  @Column()
  is_private: boolean;

  @OneToOne(() => Topic)
  @JoinColumn({ name: 'last_topic_id' })
  last_topic: Topic;

  @Column({ nullable: true })
  last_topic_id: number | null;

  @Column()
  name: string;

  @Column()
  nest_depth: number;

  @Column()
  nest_left: number;

  @Column()
  nest_right: number;

  @Column({ nullable: true })
  parent_id: number | null;

  @Column()
  post_count: number;

  @Column()
  topic_count: number;

  @OneToMany(() => Topic, topic => topic.area)
  topics: Topic[];
}
