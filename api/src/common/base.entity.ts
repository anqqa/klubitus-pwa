// tslint:disable:variable-name
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  can(doAction: string, withRoles?: string[]): boolean {
    const requireAny = this.acl()[doAction] || [];
    const matches = requireAny.filter(role => withRoles.includes(role));

    return requireAny.length === 0 || matches.length > 0;
  }

  protected acl(): Record<any, string[]> {
    return {};
  }
}
