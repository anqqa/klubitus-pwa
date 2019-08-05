import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreatePayload } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(payload: CreatePayload): Promise<User> {
    const { email, password, username } = payload;

    const newUser = new User();
    newUser.username = username;
    newUser.email = email.toLowerCase();
    newUser.setPassword(password);

    return this.userRepository.save(newUser);
  }
}
