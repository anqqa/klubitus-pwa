const { Event } = require('../models/Event');

const getEvent = {
  schema: {
    params:   {
      type:       'object',
      required:   ['eventId'],
      properties: { eventId: { type: 'integer' } },
    },
    response: {
      200: {
        type:       'object',
        properties: {
          data: Event.jsonSchema,
        }
      }
    }
  }
};


const getEvents = {
  schema: {
    querystring: {
      from:   { type: 'string', description: 'Fetch events ending after this date' },
      to:     { type: 'string', description: 'Fetch events starting before this date' },
      limit:  { type: 'integer' },
      offset: { type: 'integer' }
    },
    response:    {
      200: {
        type:       'object',
        properties: {
          data: { type: 'array', items: Event.jsonSchema },
        }
      }
    }
  }
};


module.exports = {
  getEvent,
  getEvents,
};
