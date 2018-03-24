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

  // Security
  fastify.register(require('fastify-helmet'));
  fastify.use(require('cors')());

  // Register database connection
  fastify.register(require('fastify-knexjs'), {
    client:     'pg',
    connection: 'postgres://klubitus:klubitus@localhost:5432/klubitus',
    pool:       {
      afterCreate: (connection, done) => {
        connection.query('SET timezone = "Europe/Helsinki";');

        done();
      }
    }
  });

  // Register Swagger
  fastify.register(require('fastify-swagger'), swaggerOptions);

  // Register routes and custom plugins
  fastify.options('/*', (request, reply) => {});
  fastify.register(require('./auth/plugin'));
  fastify.register(require('./events/routes'));

};
