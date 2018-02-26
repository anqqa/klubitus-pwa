'use strict';

require('make-promises-safe');


const swaggerOptions = {
  swagger:     {
    info:     { title: 'Klubitus API', version: '0.0.1', },
    host:     'localhost:3001',
    schemes:  ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
};


module.exports = async (fastify, options) => {
  fastify.addHook('preHandler', (request, reply, next) => {
    reply.header('Access-Control-Allow-Credentials', 'true');
    reply.header('Access-Control-Allow-Origin', '*');
    next();
  });

  // Register database connection
  fastify.register(require('fastify-postgres'), {
    connectionString: 'postgres://klubitus:klubitus@localhost:5432/klubitus'
  });

  // Register Swagger
  fastify.register(require('fastify-swagger'), swaggerOptions);

  // Register routes
  fastify.register(require('./events/routes'));


};
