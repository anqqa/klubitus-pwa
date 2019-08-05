import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../common/basecrud.service';
import { Shout } from './shout.entity';

@Injectable()
export class ShoutsService extends BaseCrudService<Shout> {
  constructor(@InjectRepository(Shout) repo: Repository<Shout>) {
    super(repo);
  }
}
