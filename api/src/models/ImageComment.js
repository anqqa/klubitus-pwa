const { Model } = require('./Model');


class ImageComment extends Model {

  static get tableName() {
    return 'image_comments';
  }


  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        author_id:  { type: 'integer' },
        comment:    { type: 'string' },
        created_at: { type: 'string', description: 'DateTime string' },
        id:         { type: 'integer' },
        image_id:   { type: 'integer' },
        user_id:    { anyOf: [{ type: 'integer' }, { type: 'null' }] },
      },
    };
  }


  static get relationMappings() {
    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'User',
        join:       { from: 'image_comments.author_id', to: 'users.id' },
      },

      image: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'Image',
        join:       { from: 'image_comments.image_id', to: 'images.id' },
      },

      user: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'User',
        join:       { from: 'image_comments.user_id', to: 'users.id' },
      },
    };
  }

}


module.exports = { ImageComment };
