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
    return {
      forum_topics: {
        relation:   Model.HasManyRelation,
        modelClass: 'ForumTopic',
        join:       { from: 'forum_areas.id', to: 'forum_topics.forum_area_id' },
      },

      last_topic: {
        relation:   Model.BelongsToOneRelation,
        modelClass: 'ForumTopic',
        join:       { from: 'forum_areas.last_topic_id', to: 'forum_topics.id' },
      },
    };
  }

}


module.exports = { ForumArea };
