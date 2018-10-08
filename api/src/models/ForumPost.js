const { Model } = require('./Model');


class ForumPost extends Model {

  static get tableName() {
    return 'forum_posts';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'forum_topic_id', 'post'],

      properties: {
        author_name:    { type: 'string' },
        created_at:     { type: 'string', description: 'DateTime string' },
        forum_area_id:  { type: 'integer' },
        forum_topic_id: { type: 'integer' },
        id:             { type: 'integer' },
        parent_id:      { type: 'integer' },
        post:           { type: 'string' },
        updated_at:     { type: 'string', description: 'DateTime string' },
      },
    };
  }


  static get relationMappings() {
    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'ForumUser',
        join:       { from: 'forum_posts.author_id', to: 'users.id' },
      },

      forum_area: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'ForumArea',
        join:       { from: 'forum_posts.forum_area_id', to: 'forum_areas.id' },
      },

      forum_topic: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'ForumTopic',
        join:       { from: 'forum_posts.forum_topic_id', to: 'forum_topics.id' },
      },
    };
  }

}


module.exports = { ForumPost };
