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
    return {
      default_image: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'Image',
        join:       { from: 'galleries.default_image_id', to: 'images.id' },
      },

      event: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'Event',
        join:       { from: 'galleries.event_id', to: 'events.id' },
      },

      images: {
        relation:   Model.ManyToManyRelation,
        modelClass: 'Image',
        join:       {
          from:    'galleries.id',
          through: { from: 'galleries_images.gallery_id', to: 'galleries_images.image_id' },
          to:      'images.id',
        }
      },
    };
  }
}


module.exports = { Gallery };
