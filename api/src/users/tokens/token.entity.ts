// tslint:disable:variable-name
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../forum/users/user.entity';

@Entity('user_tokens')
export class Token {
  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', { nullable: true })
  expires_at: Date | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_agent: string | null;
}
