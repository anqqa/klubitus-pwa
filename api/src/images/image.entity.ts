// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { isEmpty } from 'lodash';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base.entity';
import { imageUrl } from '../common/helpers/url.util';
import { User } from '../users/user.entity';
import { Comment } from './comments/comment.entity';
import { Note } from './notes/note.entity';

interface Label {
  Confidence: number;
  Instances: object[];
  Name: string;
  Parents: Array<{ Name: string }>;
}

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

  @Column({ nullable: true })
  file?: string;

  @Column({ nullable: true })
  height?: number;

  @Column('jsonb', { nullable: true })
  labels?: Label[];

  @Column({ nullable: true })
  mime_type?: string;

  @OneToMany(() => Note, note => note.image)
  notes?: Note[];

  @Column({ nullable: true })
  original_filename?: string;

  @Column({ nullable: true })
  original_height?: number;

  @Column({ nullable: true })
  original_size?: number;

  @Column({ nullable: true })
  original_width?: number;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  phash?: string;

  @Column({ nullable: true })
  postfix?: string;

  tags?: Tag[];

  url?: string;

  @Column('uuid', { nullable: true })
  uuid?: string;

  @Column()
  view_count: number;

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
