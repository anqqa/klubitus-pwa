const { format, parse } = require('date-fns');
const fs                = require('fs-extra');
const get               = require('lodash').get;
const mimeTypes         = require('mime-types');
const { raw }           = require('objection');
const path              = require('path');
const pump              = require('pump');
const uuid              = require('uuid/v4');

const { Gallery } = require('../models/Gallery');
const { Image } = require('../models/Image');
const { detectLabels, getKeyForImage, uploadToS3 } = require('../utils/aws');
const { dominantColor, metadata, phash, rgb2hex } = require('../utils/image');

const {
  getGalleries: getGalleriesSchema,
  getGallery:   getGallerySchema,
  getImage:     getImageSchema,
  getImages:    getImagesSchema,
  getStats:     getStatsSchema,
} = require('./schemas');


module.exports = async (fastify, options) => {

  /**
   * Get galleries ordered by event date.
   */
  fastify.get('/galleries', getGalleriesSchema, async (request, reply) => {
    const { from, to, limit, offset, event_id } = request.query;

    let query = Gallery.query()
      .eager('[default_image, event]');

    if (event_id) {
      query = query.where('event_id', event_id);
    }
    else if (from && to) {

      // If date range is given then order by event date, otherwise updated date
      const dateFrom = parse(from);
      const dateTo   = parse(to);

      query = query.orderBy('event_date', 'DESC')
        .whereBetween('event_date', [format(dateFrom, 'YYYY-MM-DD'), format(dateTo, 'YYYY-MM-DD')]);

    }

    query = query.limit(Math.max(1, Math.min(limit || 100, 100)));

    if (offset) {
      query = query.offset(offset);
    }

    const data = await query.select().orderBy('updated_at', 'DESC');

    // Call toJSON to get virtual attrs
    return { data: data.map(o => o.toJSON()) };
  });


  /**
   * Get galleries stats.
   */
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


  /**
   * Upload images.
   */
  fastify.post('/galleries/upload', (request, reply) => {
    const targetField = 'photos';
    const uploadPath  = path.normalize('./upload/');

    fs.ensureDirSync(uploadPath);

    const image = {
      author_id:         fastify.auth.userId,
      color:             null,
      event_id:          null,
      exif:              null,
      file:              null,
      gallery_id:        null,
      labels:            null,
      mime_type:         null,
      original_filename: null,
      original_height:   null,
      original_width:    null,
      original_size:     null,
      path:              null,
      phash:             null,
      uuid:              uuid(),
    };


    function handler(field, file, filename, encoding, mimetype) {
      image.file              = `${image.uuid}.${mimeTypes.extension(mimetype)}`;
      image.mime_type         = mimetype;
      image.original_filename = filename;

      const filePath    = `${uploadPath}${image.file}`;
      const writeStream = fs.createWriteStream(filePath);

      pump(file, writeStream);
    }


    function onFinished(error) {
      if (error) {
        console.log('Failed', error);

        reply.conflict(error);

        return;
      }

      const sourcePath = `${uploadPath}${image.file}`;
      const targetKey  = image.path = getKeyForImage(image.file);

      Promise.all([
        fs.stat(sourcePath),
        metadata(sourcePath),
        dominantColor(sourcePath),
        phash(sourcePath),
        uploadToS3(sourcePath, targetKey),
      ])
        .then(results => {
          const [stats, [meta, exif], color, hash, s3] = results;

          console.log('Success', { stats, meta, exif, color, hash, s3 });

          image.original_size   = stats.size;
          image.original_width  = meta.width;
          image.original_height = meta.height;
          image.exif            = exif;
          image.color           = rgb2hex(color);
          image.phash           = hash.toString();

          return detectLabels(targetKey);
        })
        .then(labels => {
          console.log('Labels', labels);

          image.labels = labels;

          const { event_id, gallery_id, ...model } = image;

          return Image.query().insert(model);
        })
        .then(model => {
          console.log('Model inserted', model.id);

          reply.send(image.uuid);

          return true;
        })
        .catch(error => {
          console.log('Failed', error);

          reply.conflict(error);
        });
    }


    function onFormData(key, value) {
      if (key === targetField) {
        const metadata = JSON.parse(value);

        image.event_id   = get(metadata, 'event_id', null);
        image.gallery_id = get(metadata, 'gallery_id', null);
      }
    }


    const multipart = request.multipart(handler, onFinished);

    multipart.on('field', onFormData);
  });


  /**
   * Get the images of a gallery.
   */
  fastify.get('/galleries/:galleryId/images', getImagesSchema, async (request, reply) => {
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


  /**
   * Get a single image.
   */
  fastify.get('/galleries/:galleryId/:imageId', getImageSchema, async (request, reply) => {
    const data = await Image.query()
      .eager('[author, comments.[author], exif, notes]')
      .findOne('id', request.params.imageId);

    return { data: data.toJSON() };
  });


  /**
   * Get single gallery.
   */
  fastify.get('/galleries/:galleryId', getGallerySchema, async (request, reply) => {
    const data = await Gallery.query()
      .eager('event')
      .findOne('id', request.params.galleryId);

    return { data };
  });

};
