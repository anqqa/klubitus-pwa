const { Model } = require('objection');


class Event extends Model {

  static get tableName() {
    return 'events';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['begins_at', 'ends_at', 'id', 'name'],

      properties: {
        begins_at:       { type: 'string', description: 'DateTime string' },
        city_name:       { type: 'string' },
        ends_at:         { type: 'string', description: 'DateTime string' },
        facebook_id:     { type: 'integer' },
        flyer_front_url: { type: 'string' },
        id:              { type: 'integer' },
        info:            { type: 'string' },
        name:            { type: 'string', minLength: 1 },
        venue_name:      { type: 'string' },
      },
    };
  }

}


module.exports = { Event };
