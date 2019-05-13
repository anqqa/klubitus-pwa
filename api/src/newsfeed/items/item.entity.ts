// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from '../../events/event.entity';
import { Post } from '../../forum/posts/post.entity';
import { Topic } from '../../forum/topics/topic.entity';
import { Gallery } from '../../images/galleries/gallery.entity';
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
  target_flyer_id: number | null;

  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: 'target_forum_post_id' })
  target_forum_post: Post | null;

  @ManyToOne(() => Topic, { nullable: true })
  @JoinColumn({ name: 'target_forum_topic_id' })
  target_forum_topic: Topic | null;

  @ManyToOne(() => Gallery, { nullable: true })
  @JoinColumn({ name: 'target_gallery_id' })
  target_gallery: Gallery | null;

  @ManyToOne(() => Image, { nullable: true })
  @JoinColumn({ name: 'target_image_id' })
  target_image: Image | null;

  @Column({ nullable: true })
  target_track_id: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'target_user_id' })
  target_user: User | null;

  @Column({ nullable: true })
  target_venue_id: number | null;
}
