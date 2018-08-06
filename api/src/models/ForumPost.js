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
    const { ForumArea }  = require('./ForumArea');
    const { ForumTopic } = require('./ForumTopic');
    const { ForumUser }  = require('./ForumUser');

    return {
      author: {
        relation:   Model.BelongsToOneRelation,
        modelClass: ForumUser,
        join:       { from: `${ForumPost.tableName}.author_id`, to: `${ForumUser.tableName}.id` },
      },

      forum_area: {
        relation:   Model.BelongsToOneRelation,
        modelClass: ForumArea,
        join:       { from: `${ForumPost.tableName}.forum_area_id`, to: `${ForumArea.tableName}.id` },
      },

      forum_topic: {
        relation:   Model.BelongsToOneRelation,
        modelClass: ForumTopic,
        join:       { from: `${ForumPost.tableName}.forum_topic_id`, to: `${ForumTopic.tableName}.id` },
      },
    };
  }

}


module.exports = { ForumPost };
