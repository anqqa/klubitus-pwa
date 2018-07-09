const fastifyPlugin = require('fastify-plugin');
const knex          = require('knex');
const { Model }     = require('objection');
const pg            = require('pg');

const { stringToDateUTC } = require('./utils/types');


function fastifyKnexJS(fastify, opts, next) {
  try {
    const BIGINT_OID    = 20;
    const TIMESTAMP_OID = 1114;

    // Postgres returns bigints as strings
    pg.types.setTypeParser(BIGINT_OID, parseInt);

    // Timestamps without timezone are in server's timezone instead of UTC
    pg.types.setTypeParser(TIMESTAMP_OID, stringToDateUTC);

    const handler = knex(opts);

    // Hook Knex to Objection
    Model.knex(handler);

    fastify.decorate('knex', handler);

    next();
  }
  catch (error) {
    next(error);
  }
}


module.exports = fastifyPlugin(fastifyKnexJS);
