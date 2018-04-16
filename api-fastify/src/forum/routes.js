const { ForumArea }       = require('../models/ForumArea');
const { ForumTopic }      = require('../models/ForumTopic');

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
    const { area, limit } = request.query;

    let query = ForumTopic.query()
      .eager('author')
      .orderBy('last_post_at', 'desc')
      .limit(Math.max(1, Math.min(limit || 20, 100)));

    if (area) {
      query = query.where('forum_area_id', area);
    }

    const data = await query.select();

    return { data };
  });

};
