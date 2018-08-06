const { Model } = require('./Model');


class Gallery extends Model {

  static get tableName() {
    return 'galleries';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'name'],

      properties: {
        copyright:        { type: 'string' },
        created_at:       { type: 'string' },
        default_image_id: { type: 'integer' },
        event_date:       { type: 'string' },
        event_id:         { type: 'integer' },
        id:               { type: 'integer' },
        image_count:      { type: 'integer' },
        name:             { type: 'string' },
        updated_at:       { type: 'string' },
      },
    };
  }


  static get relationMappings() {
    const { Event } = require('./Event');
    const { Image } = require('./Image');

    return {
      default_image: {
        relation:   Model.BelongsToOneRelation,
        modelClass: Image,
        join:       { from: `${Gallery.tableName}.default_image_id`, to: `${Image.tableName}.id` },
      },

      event: {
        relation:   Model.BelongsToOneRelation,
        modelClass: Event,
        join:       { from: `${Gallery.tableName}.event_id`, to: `${Event.tableName}.id` },
      },
    };
  }
}


module.exports = { Gallery };
