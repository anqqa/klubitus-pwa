// tslint:disable:variable-name
import { CrudActions } from '@nestjsx/crud';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { Roles, userRole } from '../../common/utils/role.util';
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

  protected acl(): Record<any, string[]> {
    const owner = userRole(this.user_id);

    return {
      [CrudActions.CreateMany]: [Roles.AUTHENTICATED, owner],
      [CrudActions.CreateOne]: [Roles.AUTHENTICATED, owner],
      [CrudActions.DeleteOne]: [Roles.ADMIN, owner],
      [CrudActions.ReadOne]: [],
      [CrudActions.ReadAll]: [],
      [CrudActions.ReplaceOne]: [Roles.ADMIN, owner],
      [CrudActions.UpdateOne]: [Roles.ADMIN, owner],
    };
  }
}
