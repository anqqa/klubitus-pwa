const { Model } = require('./Model');


class ForumArea extends Model {

  static get tableName() {
    return 'forum_areas';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'name'],

      properties: {
        description:   { type: ['string', 'null'] },
        id:            { type: 'integer' },
        is_moderated:  { type: 'boolean' },
        is_private:    { type: 'boolean' },
        last_topic_id: { type: ['integer', 'null'] },
        name:          { type: 'string' },
        nest_depth:    { type: 'integer' },
        nest_left:     { type: 'integer' },
        nest_right:    { type: 'integer' },
        parent_id:     { type: ['integer', 'null'] },
        post_count:    { type: 'integer' },
        topic_count:   { type: 'integer' },
      },
    };
  }


  static get relationMappings() {
    const { ForumTopic } = require('./ForumTopic');

    return {
      forum_topics: {
        relation:   Model.HasManyRelation,
        modelClass: ForumTopic,
        join:       { from: `${ForumArea.tableName}.id`, to: `${ForumTopic.tableName}.forum_area_id` },
      },

      last_topic: {
        relation:   Model.BelongsToOneRelation,
        modelClass: ForumTopic,
        join:       { from: `${ForumArea.tableName}.last_topic_id`, to: `${ForumTopic.tableName}.id` },
      },
    };
  }

}


module.exports = { ForumArea };
