// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { Event } from '../../events/events.dto';
import { Post } from '../../forum/posts/posts.dto';
import { Topic } from '../../forum/topics/topics.dto';
import { Gallery } from '../../galleries/galleries.dto';
import { Image } from '../../images/images.dto';
import { User } from '../../users/users.dto';

@Expose()
export class Item {
  @ApiModelProperty()
  class: string;

  @ApiModelProperty({ type: String, format: 'date-time' })
  created_at: Date;

  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  @Type(() => User)
  user: User;

  @ApiModelProperty()
  user_id: number;

  @ApiModelProperty()
  type: string;

  @ApiModelPropertyOptional()
  target_blog_entry_id?: number;

  @ApiModelPropertyOptional()
  @Type(() => Event)
  target_event?: Event;

  @ApiModelPropertyOptional()
  target_event_id?: number;

  @ApiModelPropertyOptional()
  target_flyer_id?: number;

  @ApiModelPropertyOptional()
  @Type(() => Post)
  target_forum_post?: Post;

  @ApiModelPropertyOptional()
  target_forum_post_id?: number;

  @ApiModelPropertyOptional()
  @Type(() => Topic)
  target_forum_topic?: Topic;

  @ApiModelPropertyOptional()
  target_forum_topic_id?: number;

  @ApiModelPropertyOptional()
  @Type(() => Gallery)
  target_gallery?: Gallery;

  @ApiModelPropertyOptional()
  target_gallery_id?: number;

  @ApiModelPropertyOptional()
  @Type(() => Image)
  target_image?: Image;

  @ApiModelPropertyOptional()
  target_image_id?: number;

  @ApiModelPropertyOptional()
  target_track_id?: number;

  @ApiModelPropertyOptional()
  @Type(() => User)
  target_user?: User;

  @ApiModelPropertyOptional()
  target_user_id?: number;

  @ApiModelPropertyOptional()
  target_venue_id?: number;
}
