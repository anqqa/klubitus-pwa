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
        join:       { from: `${this.tableName}.default_image_id`, to: `${Image.tableName}.id` },
      },

      event: {
        relation:   Model.BelongsToOneRelation,
        modelClass: Event,
        join:       { from: `${this.tableName}.event_id`, to: `${Event.tableName}.id` },
      },

      images: {
        relation:   Model.ManyToManyRelation,
        modelClass: Image,
        join:       {
          from:    `${this.tableName}.id`,
          through: { from: 'galleries_images.gallery_id', to: 'galleries_images.image_id' },
          to:      `${Image.tableName}.id`
        }
      },
    };
  }
}


module.exports = { Gallery };
