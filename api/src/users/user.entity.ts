// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { IsFQDN } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class BaseUser {
  @Column({ nullable: true })
  @IsFQDN()
  avatar_url: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}

@Entity('users')
export class User extends BaseUser {}
