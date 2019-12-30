// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isEmpty } from 'lodash';

import { User } from '../users/users.dto';
import { Comment } from './comments/comments.dto';
import { Image as ImageEntity } from './image.entity';
import { Note } from './notes/notes.dto';

@Expose()
class Label {
  Confidence: number;
  Instances: object[];
  Name: string;
  Parents: Array<{ Name: string }>;
}

@Expose()
class Tag {
  children?: Tag[];
  @ApiProperty()
  confidence: number;
  @ApiProperty()
  name: string;
  parents?: string[];
}

@Expose()
export class Exif {
  @ApiPropertyOptional()
  altitude?: number;

  @ApiPropertyOptional()
  altitude_ref?: string;

  @ApiPropertyOptional()
  aperture?: number;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiPropertyOptional()
  exposure?: string;

  @ApiPropertyOptional()
  flash?: string;

  @ApiPropertyOptional()
  focal?: number;

  @ApiPropertyOptional()
  iso?: number;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  latitude_ref?: string;

  @ApiPropertyOptional()
  lens_make?: string;

  @ApiPropertyOptional()
  lens_model?: string;

  @ApiPropertyOptional()
  longitude?: string;

  @ApiPropertyOptional()
  longitude_ref?: string;

  @ApiPropertyOptional()
  make?: string;

  @ApiPropertyOptional()
  metering?: string;

  @ApiPropertyOptional()
  model?: string;

  @ApiPropertyOptional()
  program?: string;
}

export class Image {
  @ApiPropertyOptional()
  @Expose()
  @Type(() => User)
  author?: User;

  @ApiPropertyOptional()
  @Expose()
  author_id?: number;

  @ApiPropertyOptional()
  @Expose()
  color?: string;

  @ApiProperty()
  @Expose()
  comment_count: number;

  @ApiPropertyOptional({ type: Comment, isArray: true })
  @Expose()
  @Type(() => Comment)
  comments: Comment[];

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => Exif)
  exif?: Exif;

  @ApiPropertyOptional()
  @Expose()
  height?: number;

  @ApiProperty()
  @Expose()
  id: number;

  @ApiPropertyOptional()
  @Expose()
  mime_type?: string;

  @ApiPropertyOptional({ type: Note, isArray: true })
  @Expose()
  @Type(() => Note)
  notes: Note[];

  @ApiPropertyOptional()
  @Expose()
  path?: string;

  @ApiPropertyOptional()
  @Expose()
  postfix?: string;

  @ApiPropertyOptional({ type: Tag, isArray: true })
  @Expose({ name: 'labels' })
  @Type(() => Label)
  @Transform(labelsToTags)
  tags: Tag[];

  @ApiProperty()
  @Expose()
  @Transform((id: number, image: ImageEntity) => buildUrl(image.id, image.path, image.postfix))
  url: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @Expose()
  uuid?: string;

  @ApiProperty()
  @Expose()
  view_count: number;

  @ApiPropertyOptional()
  @Expose()
  width?: number;
}

function buildUrl(id?: number, path?: string, postfix?: string): string {
  // AWS S3 URL
  if (path) {
    return `https://${process.env.AWS_BUCKET}/${path}`;
  }

  // Convert numeric id to path, e.g. 1234567 -> 01/23/45
  const hex = id.toString(16).padStart(8, '0');
  const chunks = hex.match(/.{1,2}/g);
  chunks.pop();

  return `https://images.klubitus.org/${chunks.join('/')}/${id}_${postfix}.jpg`;
}

function labelsToTags(labels?: Label[]): Tag[] {
  if (!labels) {
    return [];
  }

  const parsed: Tag[] = labels.map(label => ({
    confidence: Math.round(label.Confidence * 100 + Number.EPSILON) / 100,
    name: label.Name,
    parents: label.Parents.map(parent => parent.Name),
  }));

  const unflatten = (tags: Tag[], parent?: Tag, tree?: Tag[]): Tag[] => {
    tree = typeof tree !== 'undefined' ? tree : [];

    const children = tags
      .filter(tag => {
        const isRoot = !parent && !tag.parents.length;
        const isChild = parent && tag.parents.includes(parent.name);

        return isRoot || isChild;
      })
      .map(child => {
        const { parents, ...parentless } = child;

        return parentless;
      });

    if (!isEmpty(children)) {
      if (!parent) {
        tree = children;
      } else {
        parent.children = children;
      }

      children.map(child => unflatten(tags, child));
    }

    return tree;
  };

  return unflatten(parsed);
}
