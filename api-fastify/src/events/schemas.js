const { Event } = require('../models/Event');

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
          data: Event.getJsonSchema(),
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
