const { Model } = require('./Model');


class Image extends Model {

  static get tableName() {
    return 'images';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id'],

      properties: {
        author_id:   { type: ['integer', 'null'] },
        description: { type: ['string', 'null'] },
        id:          { type: 'integer' },
        postfix:     { type: ['string', 'null'] },
      },
    };
  }


  static get virtualAttributes() {
    return ['url'];
  }


  url() {
    return `https://images.klubitus.org/${this.id}`;
  }

}


module.exports = { Image };
