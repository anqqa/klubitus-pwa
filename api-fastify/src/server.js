'use strict';

require('make-promises-safe');

module.exports = async (fastify, options) => {

  // Register database connection
  fastify.register(require('fastify-postgres'), {
    connectionString: 'postgres://klubitus:klubitus@localhost:5432/klubitus'
  });

  // Register routes
  fastify.register(require('./events/routes'));

};
