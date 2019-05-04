// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('forum_posts')
export class Post {
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

  @UpdateDateColumn()
  updated_at: Date;
}
