'use strict';

const { format, parse } = require('date-fns');
const { raw } = require('objection');

const { Event } = require('../models/Event');
const {
  getEvent:  getEventSchema,
  getEvents: getEventsSchema,
} = require('./schemas');

module.exports = async (fastify, options) => {

  /**
   * Get single event.
   */
  fastify.get('/events/:eventId', getEventSchema, async (request, reply) => {
    const event = await Event.query()
      .column('id', 'name', 'begins_at', 'ends_at', 'city_name', 'venue_name', 'flyer_front_url', 'info', 'facebook_id')
      .findOne('id', parseInt(request.params.eventId));

    return { data: event };
  });


  /**
   * Get events by date range.
   */
  fastify.get('/events', getEventsSchema, async (request, reply) => {
    const { from, to, limit, offset, search } = request.query;

    let limited = true;
    let order   = 'asc';

    let query = Event.query()
      .column('id', 'name', 'begins_at', 'ends_at', 'city_name', 'venue_name', 'flyer_front_url');

    if (from && to) {

      // Load between dates
      limited = false;
      query = query
        .whereRaw('begins_at::DATE <= ?', [format(parse(to), 'YYYY-MM-DD')])
        .whereRaw('ends_at >= ?', [format(parse(from), 'YYYY-MM-DD [09:59]')]);

    }
    else if (to) {

      // Load events up to date
      order = 'desc';
      query = query
        .whereRaw('begins_at::DATE <= ?', [format(parse(to), 'YYYY-MM-DD')]);

    }
    else if (!search) {

      // Load events from date
      query = query
        .whereRaw('begins_at::DATE >= ?', [format(from ? parse(from) : Date.now(), 'YYYY-MM-DD')]);

    }

    if (search) {
      order = 'desc';
      query = query.where(raw('LOWER(name)'), 'LIKE', `%${search.toString().toLowerCase()}%`);
    }

    if (limit || limited) {
      query = query.limit(Math.max(1, Math.min(parseInt(limit) || 25, 500)));
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
  fastify.get('/events/latest', async (request, reply) => {
    const { limit } = request.query;

    const query = Event.query()
      .column('id', 'name', 'begins_at')
      .limit(Math.max(1, Math.min(parseInt(limit), 100)))
      .orderBy('created_at', 'desc');

    const data = await query.select();

    return { data };
  });

};
