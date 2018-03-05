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

  // CORS
  fastify.addHook('preHandler', (request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
  });

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

  // Register routes
  fastify.register(require('./events/routes'));


};
