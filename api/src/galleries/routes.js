const { format, parse } = require('date-fns');
const { raw } = require('objection');

const { Gallery } = require('../models/Gallery');
const { Image } = require('../models/Image');

const {
  getGalleries: getGalleriesSchema,
  getGallery:   getGallerySchema,
  getImage:     getImageSchema,
  getImages:    getImagesSchema,
  getStats:     getStatsSchema,
} = require('./schemas');


module.exports = async (fastify, options) => {

  fastify.get('/galleries', getGalleriesSchema, async (request, reply) => {
    const { from, to, limit, offset } = request.query;

    let query = Gallery.query()
      .eager('[default_image, event]');

    // If date range is given then order by event date, otherwise updated date
    if (from && to) {
      const from_date = parse(from);
      const to_date   = parse(to);

      query = query.orderBy('event_date', 'DESC')
        .whereBetween('event_date', [format(from_date, 'YYYY-MM-DD'), format(to_date, 'YYYY-MM-DD')]);
    }

    if (limit) {
      query = query.limit(Math.max(1, Math.min(limit, 100)));
    }

    if (offset) {
      query = query.offset(offset);
    }

    const data = await query.select().orderBy('updated_at', 'DESC');

    // Call toJSON to get virtual attrs
    return { data: data.map(o => o.toJSON()) };
  });


  fastify.get('/galleries/stats', getStatsSchema, async (request, reply) => {
    const data = await Gallery.query()
      .select(
        raw('EXTRACT (YEAR FROM event_date) AS year'),
        raw('EXTRACT (MONTH FROM event_date) AS month'),
        raw('COUNT(id) AS gallery_count'),
        raw('SUM(image_count) AS image_count')
      )
      .groupBy('year', 'month')
      .orderBy('year', 'DESC')
      .orderBy('month', 'DESC');

    return { data };
  });


  fastify.get('/gallery/:galleryId', getGallerySchema, async (request, reply) => {
    const data = await Gallery.query()
      .eager('event')
      .findOne('id', request.params.galleryId);

    return { data };
  });


  fastify.get('/gallery/:galleryId/images', getImagesSchema, async (request, reply) => {
    const { limit, offset } = request.query;

    let query = Gallery.query()
      .eager('[images(orderById).[author]]', {
        orderById: builder => {
          builder = builder.orderBy('id');

          if (limit) {
            builder = builder.limit(Math.max(1, Math.min(limit, 100)));
          }

          if (offset) {
            builder = builder.offset(offset);
          }

          return builder;
        }
      })
      .findOne('id', request.params.galleryId);

    const data = await query.select();

    return { data: data.images.map(o => o.toJSON()) };
  });


  fastify.get('/gallery/:galleryId/:imageId', getImageSchema, async (request, reply) => {
    const data = await Image.query()
      .eager('[author, comments.[author], exif, notes]')
      .findOne('id', request.params.imageId);

    return { data: data.toJSON() };
  });

};
