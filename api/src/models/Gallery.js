const { Model } = require('objection');


class Gallery extends Model {

  static get tableName() {
    return 'galleries';
  }

  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'name'],

      properties: {
        copyright:   { type: 'string' },
        created_at:  { type: 'string' },
        event_date:  { type: 'string' },
        id:          { type: 'integer' },
        image_count: { type: 'integer' },
        name:        { type: 'string' },
        updated_at:  { type: 'string' },
      },
    };
  }

}


module.exports = { Gallery };
