const getStats = {
  schema: {
    response: {
      200: { type: 'object', properties: {
        data: { type: 'array', items: { type: 'object', properties: {
          gallery_count: { type: 'integer' },
          image_count:   { type: 'integer' },
          month:         { type: 'integer' },
          year:          { type: 'integer' },
        } } },
      } },
    },
  },
};


module.exports = {
  getStats,
};
