// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity('user_externals')
export class External {
  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', { nullable: true })
  expires_at: Date | null;

  @Column('bigint')
  external_user_id: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provider: string;

  @Column()
  token: string;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
