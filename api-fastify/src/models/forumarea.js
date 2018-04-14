const { Model } = require('objection');


class ForumArea extends Model {

  static get tableName() {
    return 'forum_areas';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'name'],

      properties: {
        description:  { type: 'string' },
        id:           { type: 'integer' },
        is_moderated: { type: 'boolean' },
        is_private:   { type: 'boolean' },
        name:         { type: 'string' },
        nest_depth:   { type: 'integer' },
        nest_left:    { type: 'integer' },
        nest_right:   { type: 'integer' },
        parent_id:    { type: 'integer' },
        post_count:   { type: 'integer' },
        topic_count:  { type: 'integer' },
      },
    };
  }


  static get relationMappings() {
    const { ForumTopic } = require('./forumtopic');

    return {
      forum_topics: {
        relation:   Model.HasManyRelation,
        modelClass: ForumTopic,
        join:       { from: `${ForumArea.tableName}.id`, to: `${ForumTopic.tableName}.forum_area_id` },
      },
    };
  }

}


module.exports = { ForumArea };
