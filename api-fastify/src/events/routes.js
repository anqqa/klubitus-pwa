'use strict';

const {
  getEvent:  getEventSchema,
  getEvents: getEventsSchema,
} = require('./schemas');

module.exports = async (fastify, options) => {

  fastify.get('/event/:eventId', getEventSchema, async (request, reply) => {
    const { rows } = await fastify.pg.query(
      'SELECT id, name, begins_at, ends_at, city_name, venue_name, flyer_front_url FROM events WHERE id = $1',
      [parseInt(request.params.eventId)]
    );

    return { data: rows[0] };
  });

  fastify.get('/events', getEventsSchema, async (request, reply) => {
    const { rows } = await fastify.pg.query(
      'SELECT id, name, begins_at, ends_at, city_name, venue_name, flyer_front_url FROM events LIMIT 10'
    );

    return { data: rows };
  });

};
