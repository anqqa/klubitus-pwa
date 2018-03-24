'use strict';

const addDays    = require('date-fns/add_days');
const crypto     = require('crypto');
const httpErrors = require('http-errors');

const { deprecatedMatch, hash, match } = require('./password');
const {
  postLogin: postLoginSchema,
} = require('./schemas');


const routes = async (fastify, options) => {

  fastify.post('/auth/login', postLoginSchema, async (request, reply) => {
    const { username, password } = request.body;

    const users = await fastify.knex
      .select('id', 'username', 'password', 'password_kohana')
      .from('users')
      .where('username', username)
      .orWhere('email', username);

    if (!users.length) {
      request.log.info('Auth: User not found');

      throw new httpErrors.Unauthorized('Bad credentials');
    }

    const user = users[0];

    // Migrate password if needed
    if (!user.password) {
      if (!user.password_kohana) {
        request.log.warn('Auth: Password migration failed, old password not found');

        throw new Error('Credentials error');
      }

      if (!deprecatedMatch(password, user.password_kohana)) {
        request.log.info('Auth: Invalid password');

        throw new httpErrors.Unauthorized('Bad credentials');
      }


      const newPassword = hash(password);
      const migrated    = await fastify.knex('users')
        .where('id', user.id)
        .update({ password: newPassword });

      if (!migrated) {
        request.log.warn('Auth: Password migration failed');

        throw new Error('Credentials error');
      }

      request.log.info('Auth: Password migrated');
    }
    else if (!match(password, user.password)) {
      request.log.info('Auth: Invalid password');

      throw new httpErrors.Unauthorized('Bad credentials');
    }

    // Generate session token, valid for 30 days
    const token = crypto.randomBytes(16).toString('hex');
    const added = await fastify.knex('user_tokens')
      .insert({
        expires_at: addDays(new Date(), 30),
        token,
        user_id:    user.id,
      });

    if (!added) {
      request.log.warn('Auth: Creating a token failed');

      throw new Error('Token error');
    }

    // Sign a payload and return JWT
    const payload = {
      id:       user.id,
      token,
      username: user.username,
    };

    reply.jwtSign(payload, (error, token) => reply.send(error || { token }));
  });

};


module.exports = routes;
