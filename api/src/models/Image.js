const { Model } = require('./Model');


class Image extends Model {

  static get tableName() {
    return 'images';
  }


  static get jsonSchema() {
    return {
      type:    'object',

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

    // Convert numeric id to path, e.g. 1234567 -> 01/23/45
    const hex    = this.id.toString(16).padStart(8, '0');
    const chunks = hex.match(/.{1,2}/g);
    chunks.pop();

    return `https://images.klubitus.org/${chunks.join('/')}/${this.id}_${this.postfix}.jpg`;
  }

}


module.exports = { Image };
