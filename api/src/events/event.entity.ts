// tslint:disable:variable-name
import { CrudActions, CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';
import { IsDateString, IsFQDN, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base.entity';
import { Roles, userRole } from '../common/utils/role.util';
import { User } from '../users/user.entity';
import { Favorite } from './favorites/favorite.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('events')
export class Event extends BaseEntity {
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsDateString({ always: true })
  @Column('timestamp')
  begins_at: Date;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  city_name?: string;

  @IsOptional({ always: true })
  @IsDateString({ always: true })
  @Column('timestamp', { nullable: true })
  ends_at?: Date;

  @IsOptional({ always: true })
  @IsInt({ always: true })
  @Column('bigint', { nullable: true })
  facebook_id?: number;

  @OneToMany(type => Favorite, favorite => favorite.event)
  favorites?: Favorite[];

  @IsOptional({ always: true })
  @IsFQDN(undefined, { always: true })
  @Column({ nullable: true })
  flyer_front_url?: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  info?: string;

  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @Column()
  name: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  @Type(type => User)
  user?: User;

  @IsNotEmpty({ groups: [CREATE] })
  @IsInt({ always: true })
  @Column('number', { nullable: true })
  user_id?: number;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  venue_name?: string;

  can(doAction: string, withRoles: string[] = []): boolean {
    const owner = userRole(this.user_id);

    let hasAccess = true;
    switch (doAction) {
      case CrudActions.CreateMany:
      case CrudActions.CreateOne:
        hasAccess = hasAccess && withRoles.includes(Roles.AUTHENTICATED);
        break;

      case CrudActions.DeleteOne:
      case CrudActions.ReplaceOne:
      case CrudActions.UpdateOne:
        hasAccess = hasAccess && (withRoles.includes(owner) || withRoles.includes(Roles.ADMIN));
        break;
    }

    return hasAccess && super.can(doAction, withRoles);
  }
}
