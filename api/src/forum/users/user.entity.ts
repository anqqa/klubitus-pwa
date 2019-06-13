import { Column, Entity } from 'typeorm';

import { BaseUser } from '../../users/user.entity';

@Entity('users')
export class User extends BaseUser {
  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  title: string;
}
