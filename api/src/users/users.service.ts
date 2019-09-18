import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../common/basecrud.service';

import { User } from './user.entity';
import { CreatePayload } from './users.dto';

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(@InjectRepository(User) readonly repo: Repository<User>) {
    super(repo);
  }

  async create(payload: CreatePayload): Promise<User> {
    const { email, password, username } = payload;

    const newUser = new User();
    newUser.username = username;
    newUser.email = email.toLowerCase();
    newUser.setPassword(password);

    return this.repo.save(newUser);
  }
}
