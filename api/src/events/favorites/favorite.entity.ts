// tslint:disable:variable-name
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/user.entity';
import { Event } from '../event.entity';

@Entity('favorites')
export class Favorite extends BaseEntity {
  @OneToOne(() => Event, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event | null;

  @Column({ nullable: true })
  event_id: number | null;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ nullable: true })
  user_id: number | null;
}
