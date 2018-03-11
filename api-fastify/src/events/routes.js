'use strict';

const { format, parse } = require('date-fns');

const {
  getEvent:  getEventSchema,
  getEvents: getEventsSchema,
} = require('./schemas');

module.exports = async (fastify, options) => {

  fastify.get('/event/:eventId', getEventSchema, async (request, reply) => {
    const events = await fastify.knex
      .column('id', 'name', 'begins_at', 'ends_at', 'city_name', 'venue_name', 'flyer_front_url')
      .from('events')
      .where('id', parseInt(request.params.eventId))
      .select();

    return { data: events[0] };
  });


  fastify.get('/events', getEventsSchema, async (request, reply) => {
    const { from, to, limit, offset } = request.query;

    let order = 'asc';
    let query = fastify.knex
      .column('id', 'name', 'begins_at', 'ends_at', 'city_name', 'venue_name', 'flyer_front_url')
      .from('events');

    if (from && to) {
      const from_date = parse(from);
      const to_date   = parse(to);

      query = query.whereRaw('begins_at::DATE <= ?', [format(to_date, 'YYYY-MM-DD')])
        .whereRaw('ends_at >= ?', [format(from_date, 'YYYY-MM-DD [09:59]')]);

      if (limit) {
        query = query.limit(limit);
      }
    }
    else if (to) {
      const to_date = parse(to);

      order = 'desc';
      query = query.whereRaw('begins_at::DATE <= ?', [format(to_date, 'YYYY-MM-DD')])
        .limit(limit || 25);
    }
    else {
      const from_date = from ? parse(from) : Date.now();

      query = query.whereRaw('begins_at::DATE >= ?', [format(from_date, 'YYYY-MM-DD')])
        .limit(limit || 25);
    }

    if (offset) {
      query = query.offset(offset);
    }

    const data = await query.select().orderBy('begins_at', order);

    return { data };
  });

};
