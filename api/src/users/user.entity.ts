// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { compareSync, hashSync } from 'bcryptjs';
import { IsFQDN } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { deprecatedMatch } from '../auth/password';

export class BaseUser {
  @Column({ nullable: true })
  @IsFQDN()
  avatar_url?: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}

@Entity('users')
export class User extends BaseUser {
  @Column()
  email: string;

  @Column()
  password?: string;

  @Column()
  password_kohana?: string;

  setPassword(password: string) {
    this.password = hashSync(password, 10);
  }

  verifyOldPassword(password: string) {
    return this.password_kohana && deprecatedMatch(password, this.password_kohana);
  }

  verifyPassword(password: string) {
    return compareSync(password, this.password);
  }
}
