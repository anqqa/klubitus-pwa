// tslint:disable:variable-name
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/user.entity';
import { Event } from '../event.entity';

@Entity('favorites')
export class Favorite extends BaseEntity {
  @OneToOne(() => Event, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @IsNotEmpty({ always: true })
  @Column({ nullable: false })
  event_id: number;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @IsNotEmpty({ always: true })
  @Column({ nullable: false })
  user_id: number;
}
