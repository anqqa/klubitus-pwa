const { ref } = require('objection');

const { ForumArea }  = require('../models/ForumArea');
const { ForumTopic } = require('../models/ForumTopic');

const {
  getAreas:  getAreasSchema,
  getTopics: getTopicsSchema,
} = require('./schemas');


module.exports = async (fastify, options) => {

  /**
   * Get forum areas.
   */
  fastify.get('/forum/areas', getAreasSchema, async (request, reply) => {
    let query = ForumArea.query()
      .eager('last_topic')
      .where('is_hidden', false)
      .orderBy('nest_left', 'asc');

    const data = await query.select();

    return { data };
  });


  /**
   * Get forum topics.
   */
  fastify.get('/forum/topics', getTopicsSchema, async (request, reply) => {
    const { area, limit, page } = request.query;
    const pageSize = Math.max(1, Math.min(limit || 20, 100));

    let query = ForumTopic.query()
      .eager('author')
      .whereExists(
        ForumArea.query()
          .select(1)
          .where({
            id: ref('forum_area_id'),
            is_hidden: false,
            is_private: fastify.auth.isAuthenticated ? ref('is_private') : false
          })
      )
      .orderBy('last_post_at', 'desc')
      .limit(pageSize);

    if (area) {
      query = query.where('forum_area_id', area);
    }

    if (page) {
      query = query.offset(pageSize * (page - 1));
    }

    const data = await query.select();

    return { data };
  });

};
