'use strict';

const _event = {
  type: 'object',
  properties: {
    city_name:       { type: 'string' },
    flyer_front_url: { type: 'string' },
    id:              { type: 'integer' },
    name:            { type: 'string' },
    venue_name:      { type: 'string' },
  },
  patternProperties: {
    '.*_at$': { type: 'string' },
  },
  require: ['begins_at', 'ends_at', 'id', 'name']
};


const getEvent = {
  schema: {
    params:   {
      type:       'object',
      required:   ['eventId'],
      properties: {
        userId: { type: 'string' }
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
