const { Shout } = require('../models/Shout');

const { getShouts: getShoutsSchema } = require('./schemas');


module.exports = async (fastify, options) => {

  fastify.get('/shouts', getShoutsSchema, async (request, reply) => {
    const { limit, offset } = request.query;

    let query = Shout.query()
      .eager('author');

    if (limit) {
      query = query.limit(Math.max(1, Math.min(limit, 100)));
    }

    if (offset) {
      query = query.offset(offset);
    }

    const data = await query.select().orderBy('id', 'DESC');

    return { data };
  });

};
