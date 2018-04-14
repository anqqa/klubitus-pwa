const { ForumArea } = require('../models/forumarea');
const { ForumTopic } = require('../models/forumtopic');

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
      .where('is_hidden', false)
      .orderBy('nest_left', 'asc');

    const data = await query.select();

    return { data };
  });


  /**
   * Get forum topics.
   */
  fastify.get('/forum/topics', getTopicsSchema, async (request, reply) => {
    const { from, to, limit, offset } = request.query;

    let query = ForumTopic.query()
      .eager('[forum_area, author]')
      .orderBy('last_post_id', 'desc')
      .limit(Math.max(1, Math.min(parseInt(limit || 20), 100)));

    const data = await query.select();

    return { data };
  });

};
