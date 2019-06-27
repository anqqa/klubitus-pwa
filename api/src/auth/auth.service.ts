import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validator } from 'class-validator';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { Repository } from 'typeorm';

import { Token } from '../users/tokens/token.entity';
import { User } from '../users/user.entity';
import { LoginPayload } from './auth.dto';
import { IFacebookLogin } from './facebook.interface';
import { FacebookService } from './facebook.service';

const LOG_CONTEXT = 'Auth';

@Injectable()
export class AuthService {
  constructor(
    private facebookService: FacebookService,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async deleteToken(token: string): Promise<boolean> {
    const userToken = await this.tokenRepository.findOne({ token });

    if (userToken) {
      await this.tokenRepository.remove(userToken);

      return true;
    }

    return false;
  }

  async facebook(token: string, userId: number, authenticatedUser?: User): Promise<IFacebookLogin> {
    return this.facebookService.login(token, userId, authenticatedUser);
  }

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

  async login(payload: LoginPayload): Promise<User> {
    const { username, password } = payload;
    const validator = new Validator();
    const where = validator.isEmail(username) ? { email: username } : { username };

    let user = await this.userRepository.findOne({ where });

    if (!user) {
      Logger.log('User not found', LOG_CONTEXT, false);

      throw new UnauthorizedException();
    }

    if (!user.password) {
      Logger.log(`Migrating password [user:${user.id}]`, LOG_CONTEXT, false);

      if (user.verifyOldPassword(password)) {
        user.setPassword(password);

        user = await this.userRepository.save(user);
      } else {
        Logger.log(`Invalid old password  [user:${user.id}]`, LOG_CONTEXT, false);

        throw new UnauthorizedException();
      }
    } else if (!user.verifyPassword(password)) {
      Logger.log(`Invalid password  [user:${user.id}]`, LOG_CONTEXT, false);

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
