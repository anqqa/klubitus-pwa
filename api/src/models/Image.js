const { Model } = require('./Model');


class Image extends Model {

  static get tableName() {
    return 'images';
  }


  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        author_id:     { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        comment_count: { type: 'integer' },
        color:         { anyOf: [{ type: 'string' }, { type: 'null' }]},
        created_at:    { type: 'string', description: 'DateTime string' },
        description:   { anyOf: [{ type: 'string' }, { type: 'null' }] },
        height:        { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        mime_type:     { anyOf: [{ type: 'string' }, { type: 'null' }] },
        id:            { type: 'integer' },
        path:          { anyOf: [{ type: 'string' }, { type: 'null' }] },
        postfix:       { anyOf: [{ type: 'string' }, { type: 'null' }] },
        uuid:          { anyOf: [{ type: 'string' }, { type: 'null' }] },
        view_count:    { type: 'integer' },
        width:         { anyOf: [{ type: 'integer' }, { type: 'null' }] },
      },
    };
  }


  static get virtualAttributes() {
    return ['url'];
  }


  static get relationMappings() {
    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'User',
        join:       { from: 'images.author_id', to: 'users.id' },
      },

      comments: {
        relation:   Model.HasManyRelation,
        modelClass: 'ImageComment',
        join:       { from: 'images.id', to: 'image_comments.image_id' },
      },

      // exif: {
      //   relation:   Model.BelongsToOneRelation,
      //   modelClass: 'ImageExif',
      //   join:       { from: 'images.id', to: 'exifs.image_id' },
      // },

      notes: {
        relation:   Model.HasManyRelation,
        modelClass: 'ImageNote',
        join:       { from: 'images.id', to: 'image_notes.image_id' },
      },
    };
  }


  url() {

    // Convert numeric id to path, e.g. 1234567 -> 01/23/45
    const hex    = this.id.toString(16).padStart(8, '0');
    const chunks = hex.match(/.{1,2}/g);
    chunks.pop();

    return `https://images.klubitus.org/${chunks.join('/')}/${this.id}_${this.postfix}.jpg`;
  }

}


module.exports = { Image };
