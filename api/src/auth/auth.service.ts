import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validator } from 'class-validator';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { Repository } from 'typeorm';

import { Token } from '../users/tokens/token.entity';
import { User } from '../users/user.entity';
import { LoginPayload } from './auth.dto';

const LOG_CONTEXT = 'Auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async generateToken(user: User): Promise<string> {
    // Generate session token, valid for 30 days
    const token = randomBytes(16).toString('hex');

    await this.tokenRepository.save({
      expires_at: addDays(new Date(), 30),
      token,
      user,
    });

    return token;
  }

  async login(credentials: LoginPayload): Promise<User> {
    const { username, password } = credentials;
    const validator = new Validator();
    const where = validator.isEmail(username) ? { email: username } : { username };

    const user = await this.userRepository.findOne({ where });

    if (!user || !user.verifyPassword(password)) {
      Logger.log(user ? 'Invalid password' : 'User not found', LOG_CONTEXT, false);

      throw new UnauthorizedException();
    }

    return user;
  }

  async validateUser(token: string): Promise<any> {
    const userToken = await this.tokenRepository.findOneOrFail({
      relations: ['user'],
      where: { token },
    });

    return userToken.user;
  }
}
