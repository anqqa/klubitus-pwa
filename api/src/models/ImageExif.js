const { Model } = require('./Model');


class ImageExif extends Model {

  static get tableName() {
    return 'exifs';
  }


  static get jsonSchema() {
    return {
      type:     'object',
      required: ['image_id'],

      properties: {
        altitude:      { anyOf: [{ type: 'string' }, { type: 'null' }] },
        altitude_ref:  { anyOf: [{ type: 'string' }, { type: 'null' }] },
        aperture:      { anyOf: [{ type: 'string' }, { type: 'null' }] },
        exposure:      { anyOf: [{ type: 'string' }, { type: 'null' }] },
        flash:         { anyOf: [{ type: 'string' }, { type: 'null' }] },
        focal:         { anyOf: [{ type: 'string' }, { type: 'null' }] },
        id:            { type: 'integer' },
        image_id:      { type: 'integer' },
        iso:           { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        latitude:      { anyOf: [{ type: 'number' }, { type: 'null' }] },
        latitude_ref:  { anyOf: [{ type: 'string' }, { type: 'null' }] },
        longitude:     { anyOf: [{ type: 'number' }, { type: 'null' }] },
        longitude_ref: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        lens:          { anyOf: [{ type: 'string' }, { type: 'null' }] },
        metering:      { anyOf: [{ type: 'string' }, { type: 'null' }] },
        program:       { anyOf: [{ type: 'string' }, { type: 'null' }] },
        taken:         { anyOf: [{ type: 'string' }, { type: 'null' }] },
        make:          { anyOf: [{ type: 'string' }, { type: 'null' }] },
        model:         { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
    };
  }

}


module.exports = { ImageExif };
