// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from '../../events';
import { Post } from '../../forum/posts';
import { Topic } from '../../forum/topics';
import { Gallery } from '../../galleries';
import { Image } from '../../images/image.entity';
import { User } from '../../users/user.entity';

@Entity('newsfeeditems')
export class Item {
  @Column()
  class: string;

  @CreateDateColumn()
  created_at: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  target_blog_entry_id: number | null;

  @ManyToOne(() => Event, { nullable: true })
  @JoinColumn({ name: 'target_event_id' })
  target_event: Event | null;

  @Column({ nullable: true })
  target_event_id: number | null;

  @Column({ nullable: true })
  target_flyer_id: number | null;

  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: 'target_forum_post_id' })
  target_forum_post: Post | null;

  @Column({ nullable: true })
  target_forum_post_id: number | null;

  @ManyToOne(() => Topic, { nullable: true })
  @JoinColumn({ name: 'target_forum_topic_id' })
  target_forum_topic: Topic | null;

  @Column({ nullable: true })
  target_forum_topic_id: number | null;

  @ManyToOne(() => Gallery, { nullable: true })
  @JoinColumn({ name: 'target_gallery_id' })
  target_gallery: Gallery | null;

  @Column({ nullable: true })
  target_gallery_id: number | null;

  @ManyToOne(() => Image, { nullable: true })
  @JoinColumn({ name: 'target_image_id' })
  target_image: Image | null;

  @Column({ nullable: true })
  target_image_id: number | null;

  @Column({ nullable: true })
  target_track_id: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'target_user_id' })
  target_user: User | null;

  @Column({ nullable: true })
  target_user_id: number | null;

  @Column({ nullable: true })
  target_venue_id: number | null;
}

export const Relations: Record<string, any[]> = {
  target_event: [Event, 'event'],
  target_forum_post: [Post, 'post'],
  target_forum_topic: [Topic, 'topic'],
  target_gallery: [Gallery, 'gallery'],
  target_image: [Image, 'image'],
  target_user: [User, 'user'],
  user: [User, 'user'],
};
