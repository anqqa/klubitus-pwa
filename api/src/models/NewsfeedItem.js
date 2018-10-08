const { Model } = require('./Model');


class NewsfeedItem extends Model {

  static get tableName() {
    return 'newsfeeditems';
  }


  static get jsonSchema() {
    return {
      type:    'object',
      require: ['id', 'user_id'],

      properties: {
        class:      { type: 'string' },
        created_at: { type: 'string', description: 'DateTime string' },
        id:         { type: 'integer' },
        type:       { type: 'string' },
        user_id:    { type: 'integer' },

        target_blog_entry_id:  { type: ['integer', 'null'] },
        target_event_id:       { type: ['integer', 'null'] },
        target_flyer_id:       { type: ['integer', 'null'] },
        target_forum_post_id:  { type: ['integer', 'null'] },
        target_forum_topic_id: { type: ['integer', 'null'] },
        target_gallery_id:     { type: ['integer', 'null'] },
        target_image_id:       { type: ['integer', 'null'] },
        target_track_id:       { type: ['integer', 'null'] },
        target_user_id:        { type: ['integer', 'null'] },
        target_venue_id:       { type: ['integer', 'null'] },
      },
    };
  }


  static get relationMappings() {
    const mappings  = {};
    const relations = {
      user:               ['User', 'users.id'],
      // target_blog_entry:
      target_event:       ['Event', 'events.id'],
      // target_flyer:
      target_forum_post:  ['ForumPost', 'forum_posts.id'],
      target_forum_topic: ['ForumTopic', 'forum_topics.id'],
      target_gallery:     ['Gallery', 'galleries.id'],
      target_image:       ['Image', 'images.id'],
      // target_track:
      target_user:        ['User', 'users.id'],
      // target_venue:
    };

    Object.keys(relations).forEach(relation => {
      const modelClass = relations[relation][0];
      const to         = relations[relation][1];
      const from       = `${NewsfeedItem.tableName}.${relation}_id`;

      mappings[relation] = {
        relation: Model.BelongsToOneRelation,
        modelClass,
        // filter:   query => query.where(from, 'is not', null),
        join:     { from, to },
      };
    });

    return mappings;
  }

}


module.exports = { NewsfeedItem };
