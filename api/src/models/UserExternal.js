const { Model } = require('./Model');

class UserExternal extends Model {
  static get tableName() {
    return 'user_externals';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      require: ['external_user_id', 'id', 'token', 'user_id'],

      properties: {
        created_at: { type: 'string', description: 'DateTime string' },
        expires_at: {
          anyOf: [{ type: 'string' }, { type: 'null' }],
          description: 'DateTime string',
        },
        external_user_id: { type: 'integer' },
        id: { type: 'integer' },
        provider: { type: 'string' },
        token: { type: 'string' },
        updated_at: {
          anyOf: [{ type: 'string' }, { type: 'null' }],
          description: 'DateTime string',
        },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: 'User',
        join: { from: 'user_externals.user_id', to: 'users.id' },
      },
    };
  }
}

module.exports = { UserExternal };
