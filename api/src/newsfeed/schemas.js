const { NewsfeedItem } = require('../models/NewsfeedItem');


const getNewsfeed = {
  schema: {
    querystring: {
      aggregate: { type: 'string' },
      limit:     { type: 'integer' },
      offset:    { type: 'integer' },
    },
    response:    {
      200: { type: 'object', properties: {
        data: { type: 'array', items: { type: 'array', items: NewsfeedItem.getCombinedJsonSchema() } }
      } },
    },
  }
};


module.exports = {
  getNewsfeed,
};
