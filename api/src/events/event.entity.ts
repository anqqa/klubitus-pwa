// tslint:disable:variable-name
import { IsFQDN } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class Event {
  @Column('timestamp')
  begins_at: Date;

  @Column({ nullable: true })
  city_name: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp')
  ends_at: Date;

  @Column({ nullable: true, type: 'bigint' })
  facebook_id: number | null;

  @Column({ nullable: true })
  @IsFQDN()
  flyer_front_url: string | null;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  info: string | null;

  @Column()
  name: string;

  @Column({ nullable: true })
  venue_name: string | null;
}
