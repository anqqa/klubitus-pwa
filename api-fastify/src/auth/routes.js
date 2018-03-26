'use strict';

const addDays    = require('date-fns/add_days');
const crypto     = require('crypto');
const httpErrors = require('http-errors');

const { deprecatedMatch, hash, match } = require('./password');
const {
  getMe:     getMeSchema,
  postLogin: postLoginSchema,
} = require('./schemas');


const routes = async (fastify, options) => {

  /**
   * Login with username or email and password.
   *
   * @param    request
   * @param    reply
   * @returns  {Promise<void>}
   */
  const authLogin = async (request, reply) => {
    const { username, password } = request.body;

    if (!username || !password) {
      request.log.info('Auth: Username or password not given');

      throw new httpErrors.Unauthorized('Bad credentials');
    }

    const user = await fastify.knex('users')
      .first('id', 'username', 'password', 'password_kohana')
      .where('username', username)
      .orWhere('email', username);

    if (!user) {
      request.log.info('Auth: User not found');

      throw new httpErrors.Unauthorized('Bad credentials');
    }

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

    reply.jwtSign(payload, { expiresIn: '30d', }, (error, token) => reply.send(error || { token }));
  };


  /**
   * Remove token on logout.
   *
   * @param   request
   * @param   reply
   * @returns  {Promise<void>}
   */
  const authLogout = async (request, reply) => {
    if (fastify.auth.userId && fastify.auth.token) {
      fastify.knex('user_tokens')
        .where({ token: fastify.auth.token, user_id: fastify.auth.userId })
        .delete()
        .then(() => request.log.info('Auth: Token removed'))
        .catch(error => request.log.warn(`Auth: Could not delete token: ${error.message}`));
    }

    reply.send();
  };


  /**
   * Get authenticated user.
   *
   * @param   request
   * @param   reply
   * @returns  {Promise<*>}
   */
  const authMe = async (request, reply) => {
    if (!fastify.auth.isAuthenticated || !fastify.auth.userId) {
      throw new httpErrors.Unauthorized();
    }

    const user = await fastify.knex('users')
      .first('id', 'username')
      .where('id', fastify.auth.userId);

    if (!user) {
      request.log.warn('Auth: Authenticated user not found');

      throw new httpErrors.NotFound();
    }

    return { data: user };
  };


  fastify.post('/auth/login', postLoginSchema, authLogin);
  fastify.post('/auth/logout', authLogout);
  fastify.get('/auth/me', getMeSchema, authMe);
};


module.exports = routes;
