// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { compareSync, hashSync } from 'bcryptjs';
import { IsFQDN } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { deprecatedMatch } from '../auth';
import { BaseEntity } from '../common/base.entity';
import { Roles, userRole } from '../common/utils/role.util';

export abstract class BaseUser extends BaseEntity {
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

  is_authenticated = false;

  get roles(): string[] {
    const roles = [userRole(this.id)];

    if (this.is_authenticated) {
      roles.push(Roles.AUTHENTICATED);
    }

    return roles;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

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
