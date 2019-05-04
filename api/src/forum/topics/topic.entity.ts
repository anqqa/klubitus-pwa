// tslint:disable:variable-name
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('forum_topics')
export class Topic {
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

  @Column('timestamp')
  last_post_at: Date;

  @Column()
  last_post_id: number;

  @Column()
  name: string;

  @Column()
  post_count: number;

  @Column()
  read_count: number;
}
