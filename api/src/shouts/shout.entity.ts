// tslint:disable:variable-name
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';

@Entity('shouts')
export class Shout extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  author_id: number;

  @Column()
  shout: string;
}
