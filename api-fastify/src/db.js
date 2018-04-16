const fastifyPlugin = require('fastify-plugin');
const knex          = require('knex');
const { Model }     = require('objection');


function fastifyKnexJS(fastify, opts, next) {
  try {
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
