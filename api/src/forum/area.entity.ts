// tslint:disable:variable-name
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
