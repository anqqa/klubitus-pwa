'use strict';

const _event = {
  type: 'object',
  properties: {
    begins_at:       { type: 'string', description: 'DateTime string' },
    city_name:       { type: 'string' },
    ends_at:         { type: 'string', description: 'DateTime string' },
    flyer_front_url: { type: 'string' },
    id:              { type: 'integer' },
    name:            { type: 'string' },
    venue_name:      { type: 'string' },
  },
  require: ['begins_at', 'ends_at', 'id', 'name']
};


const getEvent = {
  schema: {
    params:   {
      type:       'object',
      required:   ['eventId'],
      properties: {
        eventId: { type: 'string', description: 'Event ID or slug, e.g. 123-event-name' },
      },
    },
    response: {
      200: {
        type:       'object',
        properties: {
          data: _event
        }
      }
    }
  }
};


const getEvents = {
  schema: {
    response: {
      200: {
        type:       'object',
        properties: {
          data: {
            type:  'array',
            items: _event,
          }
        }
      }
    }
  }
};


module.exports = {
  getEvent,
  getEvents,
};