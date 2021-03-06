import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { Repository } from 'typeorm';

import { External } from '../users/externals/external.entity';
import { User } from '../users/user.entity';
import { IFacebookLogin } from './facebook.interface';

const LOG_CONTEXT = 'Facebook';

@Injectable()
export class FacebookService {
  private baseUrl = 'https://graph.facebook.com';
  private client: AxiosInstance;

  constructor(
    @InjectRepository(External) private readonly externalRepository: Repository<External>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    this.client = axios.create({ baseURL: this.baseUrl });

    this.client.interceptors.request.use(config => {
      const { url, method } = config;

      Logger.log(`Sending ${method.toUpperCase()} requet to ${url}`, LOG_CONTEXT, false);

      return config;
    });

    this.client.interceptors.response.use(
      response => {
        const { config, status, statusText, data } = response;

        Logger.log(`Response from ${config.url}: ${status}:${statusText}`, LOG_CONTEXT, false);

        return response;
      },
      error => {
        const { config, response } = error;
        const { status, statusText, data } = response;
        const { message, type, code } = data.error;

        Logger.warn(`Request to ${config.url} failed: ${status}:${statusText}`, LOG_CONTEXT, false);

        return Promise.reject(data.error);
      }
    );
  }

  async login(token: string, userId: number, authenticatedUser?: User): Promise<IFacebookLogin> {
    Logger.log('Attempting login', LOG_CONTEXT, false);

    let email: string;
    let id: number;
    let name: string;

    try {
      const response = await this.me(token, ['id', 'name', 'email']);

      email = response.email;
      id = response.id;
      name = response.name;
    } catch (error) {
      const { message, type, code } = error;

      Logger.warn(`Login failed: ${type} (${code}) ${message}`, LOG_CONTEXT, false);

      throw new InternalServerErrorException('Connect with Facebook failed');
    }

    // Check that the user id from client matches the access token
    if (id !== userId) {
      Logger.warn(`Facebook user id mismatch: ${userId} vs. ${id}`, LOG_CONTEXT, false);

      throw new ConflictException('Facebook user id mismatch');
    }

    // Match existing connected user
    const externalUser = await this.externalRepository.findOne({
      external_user_id: id,
      provider: 'facebook',
    });

    if (externalUser) {
      Logger.log('Login with connected user', LOG_CONTEXT, false);

      if (authenticatedUser && authenticatedUser.id !== externalUser.user.id) {
        Logger.warn('Connected to another user', LOG_CONTEXT, false);

        throw new ConflictException('Facebook already connected to another account');
      }

      return { user: externalUser.user };
    }

    // Connect authenticated user
    if (authenticatedUser) {
      Logger.log('Connected existing user', LOG_CONTEXT, false);

      await this.externalRepository.save({
        external_user_id: id,
        provider: 'facebook',
        token,
        user: authenticatedUser,
      });

      return { connected: true, user: authenticatedUser };
    }

    if (!email) {
      Logger.log('Login attempt with unknown user without email', LOG_CONTEXT, false);

      throw new BadRequestException('Email not provided');
    }

    // Match existing email
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      Logger.log('Login attempt with non-connected user', LOG_CONTEXT, false);

      return { email, name, is_new_user: false };
    }

    Logger.log('Login attempt with unknown user', LOG_CONTEXT, false);

    return { email, name, is_new_user: true };
  }

  public async me(accessToken: string, fields: string[] = ['id']) {
    const response = await this.client.get('/me', {
      params: { fields: fields.join(','), access_token: accessToken },
    });

    return response.data;
  }
}
