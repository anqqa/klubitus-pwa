// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isEmpty } from 'lodash';

import { User } from '../users/users.dto';
import { Image as ImageEntity } from './image.entity';

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
  @ApiModelProperty()
  confidence: number;
  @ApiModelProperty()
  name: string;
  parents?: string[];
}

@Expose()
export class Exif {
  @ApiModelPropertyOptional()
  altitude?: number;

  @ApiModelPropertyOptional()
  altitude_ref?: string;

  @ApiModelPropertyOptional()
  aperture?: number;

  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiModelPropertyOptional()
  exposure?: string;

  @ApiModelPropertyOptional()
  flash?: string;

  @ApiModelPropertyOptional()
  focal?: number;

  @ApiModelPropertyOptional()
  iso?: number;

  @ApiModelPropertyOptional()
  latitude?: number;

  @ApiModelPropertyOptional()
  latitude_ref?: string;

  @ApiModelPropertyOptional()
  lens_make?: string;

  @ApiModelPropertyOptional()
  lens_model?: string;

  @ApiModelPropertyOptional()
  longitude?: string;

  @ApiModelPropertyOptional()
  longitude_ref?: string;

  @ApiModelPropertyOptional()
  make?: string;

  @ApiModelPropertyOptional()
  metering?: string;

  @ApiModelPropertyOptional()
  model?: string;

  @ApiModelPropertyOptional()
  program?: string;
}

export class Image {
  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => User)
  author?: User;

  @ApiModelPropertyOptional()
  @Expose()
  author_id?: number;

  @ApiModelPropertyOptional()
  @Expose()
  color?: string;

  @ApiModelProperty()
  @Expose()
  comment_count: number;

  @ApiModelProperty({ type: String, format: 'date-time' })
  @Expose()
  created_at: Date;

  @ApiModelPropertyOptional()
  @Expose()
  description?: string;

  @ApiModelPropertyOptional()
  @Expose()
  @Type(() => Exif)
  exif?: Exif;

  @ApiModelPropertyOptional()
  @Expose()
  height?: number;

  @ApiModelProperty()
  @Expose()
  id: number;

  @ApiModelPropertyOptional()
  @Expose()
  mime_type?: string;

  @ApiModelPropertyOptional()
  @Expose()
  path?: string;

  @ApiModelPropertyOptional()
  @Expose()
  postfix?: string;

  @ApiModelPropertyOptional({ type: Tag, isArray: true })
  @Expose({ name: 'labels' })
  @Type(() => Label)
  @Transform(labelsToTags)
  tags: Tag[];

  @ApiModelProperty()
  @Expose()
  @Transform((id: number, image: ImageEntity) => buildUrl(image.id, image.path, image.postfix))
  url: string;

  @ApiModelPropertyOptional({ format: 'uuid' })
  @Expose()
  uuid?: string;

  @ApiModelProperty()
  @Expose()
  view_count: number;

  @ApiModelPropertyOptional()
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
