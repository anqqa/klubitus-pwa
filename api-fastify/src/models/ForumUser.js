const merge = require('lodash').merge;

const { User } = require('./User');


class ForumUser extends User {
  static get jsonSchema() {
    return merge({}, super.jsonSchema, {
      properties: {
        signature: { type: ['string', 'null'] },
        title:     { type: ['string', 'null'] },
      }
    });
  }
}


module.exports = { ForumUser };
