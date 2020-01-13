// tslint:disable:variable-name
import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Roles } from './utils/role.util';

export abstract class BaseEntity {
  static fromData<T>(cls: ClassType<T>, data: Record<string, any>): T {
    return plainToClass(cls, data);
  }

  @CreateDateColumn()
  created_at: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({ nullable: true })
  updated_at?: Date;

  allows(action: string, roles?: string[]): boolean {
    // Default to allowing access to nobody
    const required = this.acl()[action] || [Roles.NOBODY];

    // Access is allows if no roles are required or at least one matches
    const hasAccess = !required.length || required.some(role => (roles || []).includes(role));

    if (hasAccess) {
      return true;
    }

    Logger.log(
      [
        `Access denied: ${action} in ${this.constructor.name}`,
        `roles: ${roles.join(',')}`,
        `required: ${required.join(',')}`,
      ].join(', '),
      'ACL',
      false
    );

    return false;
  }

  protected acl(): Record<any, string[]> {
    return {};
  }
}
