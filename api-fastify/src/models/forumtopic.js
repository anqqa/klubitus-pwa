const { Model } = require('objection');


class ForumTopic extends Model {

  static get tableName() {
    return 'forum_topics';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'name'],

      properties: {
        created_at:    { type: 'string', description: 'DateTime string' },
        first_post_id: { type: 'number' },
        id:            { type: 'integer' },
        is_locked:     { type: 'boolean' },
        is_sinking:    { type: 'boolean' },
        is_sticky:     { type: 'boolean' },
        last_post_at:  { type: 'string', description: 'DateTime string' },
        last_post_id:  { type: 'number' },
        name:          { type: 'string' },
        post_count:    { type: 'number' },
      },
    };
  }


  static get relationMappings() {
    const { ForumArea } = require('./forumarea');
    const { User } = require('./user');

    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: User,
        join:       { from: `${ForumTopic.tableName}.author_id`, to: `${User.tableName}.id` },
      },

      forum_area: {
        relation:   Model.BelongsToOneRelation,
        modelClass: ForumArea,
        join:       { from: `${ForumTopic.tableName}.forum_area_id`, to: `${ForumArea.tableName}.id` },
      },
    };
  }

}


module.exports = { ForumTopic };
