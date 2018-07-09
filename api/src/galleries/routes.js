const { raw } = require('objection');

const { Gallery } = require('../models/Gallery');

const {
  getStats: getStatsSchema,
} = require('./schemas');


module.exports = async (fastify, options) => {

  fastify.get('/galleries/stats', getStatsSchema, async (request, reply) => {

    const data = await Gallery.query()
      .select(
        raw('EXTRACT (YEAR FROM event_date) AS year'),
        raw('EXTRACT (MONTH FROM event_date) AS month'),
        raw('COUNT(id) AS gallery_count'),
        raw('SUM(image_count) AS image_count')
      )
      .groupBy('year', 'month')
      .orderBy('year', 'DESC')
      .orderBy('month', 'DESC');

    return { data };
  });

};
