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
        author_name:   { type: 'string' },
        created_at:    { type: 'string', description: 'DateTime string' },
        first_post_id: { type: 'integer' },
        forum_area_id: { type: 'integer' },
        id:            { type: 'integer' },
        is_locked:     { type: ['boolean', 'null'] },
        is_sinking:    { type: ['boolean', 'null'] },
        is_sticky:     { type: ['boolean', 'null'] },
        last_post_at:  { type: 'string', description: 'DateTime string' },
        last_post_id:  { type: 'integer' },
        name:          { type: 'string' },
        post_count:    { type: 'integer' },
      },
    };
  }


  static get relationMappings() {
    const { ForumArea } = require('./ForumArea');
    const { ForumUser } = require('./ForumUser');

    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: ForumUser,
        join:       { from: `${ForumTopic.tableName}.author_id`, to: `${ForumUser.tableName}.id` },
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