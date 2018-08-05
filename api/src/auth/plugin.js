'use strict';

const fp = require('fastify-plugin');


module.exports = fp(function (fastify, options, next) {

  /**
   * Verify JWT token.
   *
   * @param  request
   * @param  reply
   * @param  done
   * @returns  {*}
   */
  const verifyJWT = (request, reply, done) => {
    const [bearer, token] = (request.req.headers['authorization'] || '').split(' ');

    // Do nothing if no token is available
    if (!token) {
      return done();
    }


    // Validate token
    fastify.jwt.verify(token, (error, decoded) => {
      if (error || !decoded.id || !decoded.token) {
        request.log.warn('JWT: Invalid token');

        return done(new fastify.httpErrors.Unauthorized('Invalid token'));
      }

      fastify.knex('user_tokens')
        .first('expires_at')
        .where({ token: decoded.token, user_id: decoded.id})
        .then(token => {
          if (!token.expires_at || token.expires_at < new Date()) {
            request.log.info('JWT: Expired token');

            return done(new fastify.httpErrors.unauthorized('Token expired'));
          }
          fastify.auth.isAuthenticated = true;
          fastify.auth.token           = decoded.token;
          fastify.auth.userId          = decoded.id;

          done();
        })
        .catch(error => {
          request.log.warn('JWT: Missing token');

          done(new fastify.httpErrors.unauthorized('Token missing or expired'));
        });
    });
  };


  fastify.register(require('fastify-jwt'), { secret: 'dev' });
  fastify.decorate('auth', { isAuthenticated: false, token: undefined, userId: undefined });
  fastify.decorate('verifyJWT', verifyJWT);
  fastify.addHook('preHandler', verifyJWT);

  // Add routes
  fastify.register(require('./routes'));

  next();
});