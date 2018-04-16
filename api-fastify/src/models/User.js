const { Model } = require('objection');


class User extends Model {

  static get tableName() {
    return 'users';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'username'],

      properties: {
        avatar_url: { type: ['string', 'null'] },
        id:         { type: 'integer' },
        username:   { type: 'string' },
      },
    };
  }

}


module.exports = { User };
