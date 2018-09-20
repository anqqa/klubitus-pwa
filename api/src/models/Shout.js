const { Model } = require('./Model');


class Shout extends Model {

  static get tableName() {
    return 'shouts';
  }


  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        author_id:  { type: 'integer' },
        created_at: { type: 'string', description: 'DateTime string' },
        id:         { type: 'integer' },
        shout:      { type: 'string' },
      },
    };
  }


  static get relationMappings() {
    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'User',
        join:       { from: 'shouts.author_id', to: 'users.id' },
      },
    };
  }

}


module.exports = { Shout };
