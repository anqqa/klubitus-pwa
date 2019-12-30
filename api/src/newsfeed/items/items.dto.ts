// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { Event } from '../../events/events.dto';
import { Post } from '../../forum/posts/posts.dto';
import { Topic } from '../../forum/topics/topics.dto';
import { Gallery } from '../../galleries/galleries.dto';
import { Image } from '../../images/images.dto';
import { User } from '../../users/users.dto';

@Expose()
export class Item {
  @ApiProperty()
  class: string;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiProperty()
  id: number;

  @ApiProperty()
  @Type(() => User)
  user: User;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  target_blog_entry_id?: number;

  @ApiPropertyOptional()
  @Type(() => Event)
  target_event?: Event;

  @ApiPropertyOptional()
  target_event_id?: number;

  @ApiPropertyOptional()
  target_flyer_id?: number;

  @ApiPropertyOptional()
  @Type(() => Post)
  target_forum_post?: Post;

  @ApiPropertyOptional()
  target_forum_post_id?: number;

  @ApiPropertyOptional()
  @Type(() => Topic)
  target_forum_topic?: Topic;

  @ApiPropertyOptional()
  target_forum_topic_id?: number;

  @ApiPropertyOptional()
  @Type(() => Gallery)
  target_gallery?: Gallery;

  @ApiPropertyOptional()
  target_gallery_id?: number;

  @ApiPropertyOptional()
  @Type(() => Image)
  target_image?: Image;

  @ApiPropertyOptional()
  target_image_id?: number;

  @ApiPropertyOptional()
  target_track_id?: number;

  @ApiPropertyOptional()
  @Type(() => User)
  target_user?: User;

  @ApiPropertyOptional()
  target_user_id?: number;

  @ApiPropertyOptional()
  target_venue_id?: number;
}
