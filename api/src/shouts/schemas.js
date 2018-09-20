const { Shout } = require('../models/Shout');


const getShouts = {
  schema: {
    querystring: { limit: { type: 'integer' }, offset: { type: 'integer' } },
    response:    {
      200: { type: 'object', properties: {
        data: { type: 'array', items: Shout.combinedJsonSchema }
      } },
    },
  }
};


module.exports = {
  getShouts,
};
