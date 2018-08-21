const { Gallery } = require('../models/Gallery');
const { Image } = require('../models/Image');


const getGalleries = {
  schema: {
    querystring: {
      from:   { type: 'string', description: 'Fetch galleries ending after this date' },
      to:     { type: 'string', description: 'Fetch galleries starting before this date' },
      limit:  { type: 'integer' },
      offset: { type: 'integer' }
    },
    response:    {
      200: { type: 'object', properties: {
        data: { type: 'array', items: Gallery.combinedJsonSchema }
      } },
    },
  }
};


const getGallery = {
  schema: {
    params:   {
      type:       'object',
      required:   ['galleryId'],
      properties: { galleryId: { type: 'integer' } },
    },
    response: {
      200: { type: 'object', properties: {
        data: Gallery.combinedJsonSchema
      } },
    },
  }
};


const getImages = {
  schema: {
    params:   {
      type:       'object',
      required:   ['galleryId'],
      properties: { galleryId: { type: 'integer' } },
    },
    querystring: {
      limit:  { type: 'integer' },
      offset: { type: 'integer' }
    },
    response: {
      200: { type: 'object', properties: {
        data: { type: 'array', items: Image.combinedJsonSchema }
      } },
    },
  },
};


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
  getGalleries,
  getGallery,
  getImages,
  getStats,
};
