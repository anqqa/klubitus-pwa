const { Model } = require('./Model');


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
    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'ForumUser',
        join:       { from: 'forum_topics.author_id', to: 'users.id' },
      },

      forum_area: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'ForumArea',
        join:       { from: 'forum_topics.forum_area_id', to: 'forum_areas.id' },
      },

      last_post: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'ForumPost',
        join:       { from: 'forum_topics.last_post_id', to: 'forum_posts.id' },
      },
    };
  }

}


module.exports = { ForumTopic };
