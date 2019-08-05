// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { Label } from 'aws-sdk/clients/rekognition';
import { Exclude } from 'class-transformer';
import { isEmpty } from 'lodash';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base.entity';
import { imageUrl } from '../common/helpers/url.util';
import { User } from '../users/user.entity';
import { Comment } from './comments/comment.entity';
import { Note } from './notes/note.entity';

interface Tag {
  children?: Tag[];
  confidence: number;
  name: string;
  parents?: string[];
}

export abstract class BaseImage extends BaseEntity {
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author?: User;

  @Column({ nullable: true })
  author_id?: number;

  @Column({ nullable: true })
  color?: string;

  @Column()
  comment_count: number;

  @OneToMany(() => Comment, comment => comment.image)
  comments?: Comment[];

  @Column({ nullable: true })
  description?: string;

  @Column('jsonb', { nullable: true })
  exif?: Record<string, string | number> | null;

  @Exclude()
  @Column({ nullable: true })
  file?: string;

  @Exclude()
  @Column({ nullable: true })
  height?: number;

  @Exclude()
  @Column('jsonb', { nullable: true })
  labels?: Label[];

  @Exclude()
  @Column({ nullable: true })
  mime_type?: string;

  @OneToMany(() => Note, note => note.image)
  notes?: Note[];

  @Exclude()
  @Column({ nullable: true })
  original_filename?: string;

  @Column({ nullable: true })
  original_height?: number;

  @Column({ nullable: true })
  original_size?: number;

  @Column({ nullable: true })
  original_width?: number;

  @Exclude()
  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  phash?: string;

  @Exclude()
  @Column({ nullable: true })
  postfix?: string;

  tags?: Tag[];

  url?: string;

  @Exclude()
  updated_at?: Date;

  @Exclude()
  @Column('uuid', { nullable: true })
  uuid?: string;

  @Column()
  view_count: number;

  @Exclude()
  @Column({ nullable: true })
  width?: number;

  @AfterLoad()
  computedColumns() {
    this.tags = labelsToTags(this.labels);
    this.url = imageUrl(this.id, this.path, this.postfix);
  }
}

@Entity('images')
export class Image extends BaseImage {}

const labelsToTags = (labels?: Label[]): Tag[] => {
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
};
