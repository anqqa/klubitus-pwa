import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import DatabaseModule from './db.module';

@Module({
  imports: [DatabaseModule],
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
