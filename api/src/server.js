require('make-promises-safe');
require('dotenv').config();

const { objectDateToStr } = require('./utils/types');


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
  fastify.register(require('fastify-cors'));
  fastify.register(require('fastify-helmet'));
  fastify.register(require('fastify-multipart'));
  fastify.register(require('fastify-sensible'));

  // Register database connection
  fastify.register(require('./db'), {
    client:     'pg',
    connection: {
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    debug:      true,
    pool:       {
      afterCreate: (connection, done) => {
        connection.query('SET timezone = "Europe/Helsinki";');

        done();
      }
    },
    postProcessResponse: (result, queryContext) => {

      // Objection's relations containing Dates fail serializer
      objectDateToStr(result);

      return result;
    }
  });

  // Register Swagger
  fastify.register(require('fastify-swagger'), swaggerOptions);

  // Register routes and custom plugins
  fastify.register(require('./auth/plugin'));
  fastify.register(require('./events/routes'));
  fastify.register(require('./forum/routes'));
  fastify.register(require('./galleries/routes'));
  fastify.register(require('./newsfeed/routes'));
  fastify.register(require('./shouts/routes'));

};
