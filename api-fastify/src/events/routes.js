'use strict';

const { format, parse } = require('date-fns');

const { Event } = require('../models/event');
const {
  getEvent:  getEventSchema,
  getEvents: getEventsSchema,
} = require('./schemas');

module.exports = async (fastify, options) => {

  /**
   * Get single event.
   */
  fastify.get('/event/:eventId', getEventSchema, async (request, reply) => {
    const events = await fastify.knex
      .column('id', 'name', 'begins_at', 'ends_at', 'city_name', 'venue_name', 'flyer_front_url', 'info', 'facebook_id')
      .from('events')
      .where('id', parseInt(request.params.eventId))
      .select();

    return { data: events[0] };
  });


  /**
   * Get events by date range.
   */
  fastify.get('/events', getEventsSchema, async (request, reply) => {
    const { from, to, limit, offset } = request.query;

    let order = 'asc';
    let query = Event.query()
      .column('id', 'name', 'begins_at', 'ends_at', 'city_name', 'venue_name', 'flyer_front_url');

    if (from && to) {
      const from_date = parse(from);
      const to_date   = parse(to);

      query = query.whereRaw('begins_at::DATE <= ?', [format(to_date, 'YYYY-MM-DD')])
        .whereRaw('ends_at >= ?', [format(from_date, 'YYYY-MM-DD [09:59]')]);

      if (limit) {
        query = query.limit(Math.max(1, Math.min(parseInt(limit), 500)));
      }
    }
    else if (to) {
      const to_date = parse(to);

      order = 'desc';
      query = query.whereRaw('begins_at::DATE <= ?', [format(to_date, 'YYYY-MM-DD')])
        .limit(Math.max(1, Math.min(parseInt(limit || 25), 500)));
    }
    else {
      const from_date = from ? parse(from) : Date.now();

      query = query.whereRaw('begins_at::DATE >= ?', [format(from_date, 'YYYY-MM-DD')])
        .limit(Math.max(1, Math.min(parseInt(limit || 25), 500)));
    }

    if (offset) {
      query = query.offset(offset);
    }

    const data = await query.select().orderBy('begins_at', order);

    return { data };
  });


  /**
   * Get events by list type.
   */
  fastify.get('/events/:type', async (request, reply) => {
    const { type }  = request.params;
    const { limit } = request.query;

    let query = Event.query()
      .column('id', 'name', 'begins_at')
      .limit(Math.max(1, Math.min(parseInt(limit), 100)));

    switch (type) {
      case 'latest': query = query.orderBy('created_at', 'desc'); break;
    }

    const data = await query.select();

    return { data };
  });

};
