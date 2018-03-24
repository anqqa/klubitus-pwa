'use strict';

const fp = require('fastify-plugin');
const httpErrors = require('http-errors');


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

    // Do nothing if no token is available
    if (!request.req.headers['auth']) {
      return done();
    }

    // Validate token
    fastify.jwt.verify(request.req.headers['auth'], (error, decoded) => {
      if (error || !decoded.id || !decoded.token) {
        return done(new httpErrors.Unauthorized('Invalid token'));
      }
    });
  };


  fastify.register(require('fastify-jwt'), { secret: 'dev' });
  fastify.decorate('verifyJWT', verifyJWT);
  fastify.addHook('preHandler', verifyJWT);

  // Add routes
  fastify.register(require('./routes'));

  next();
});
