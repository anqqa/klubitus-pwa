// tslint:disable:variable-name
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn()
  created_at: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({ nullable: true })
  updated_at?: Date;

  public can(doAction: string, withRoles?: string[]): boolean {
    return true;
  }
}
