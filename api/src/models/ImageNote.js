const { Model } = require('./Model');


class ImageNote extends Model {

  static get tableName() {
    return 'image_notes';
  }


  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        author_id:  { type: 'integer' },
        created_at: { type: 'string', description: 'DateTime string' },
        height:     { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        id:         { type: 'integer' },
        image_id:   { type: 'integer' },
        name:       { type: 'string' },
        user_id:    { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        width:      { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        x:          { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        y:          { anyOf: [{ type: 'integer' }, { type: 'null' }] },
      },
    };
  }


  static get relationMappings() {
    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'User',
        join:       { from: 'image_notes.author_id', to: 'users.id' },
      },

      image: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'Image',
        join:       { from: 'image_notes.image_id', to: 'images.id' },
      },

      user: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'User',
        join:       { from: 'image_notes.user_id', to: 'users.id' },
      },
    };
  }

}


module.exports = { ImageNote };
