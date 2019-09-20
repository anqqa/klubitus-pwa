import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCrudService } from '../../common/basecrud.service';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService extends BaseCrudService<Favorite> {
  constructor(@InjectRepository(Favorite) repo: Repository<Favorite>) {
    super(repo);
  }
}
