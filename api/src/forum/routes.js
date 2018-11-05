const { ref } = require('objection');

const { ForumArea }  = require('../models/ForumArea');
const { ForumPost }  = require('../models/ForumPost');
const { ForumTopic } = require('../models/ForumTopic');

const {
  getAreas:  getAreasSchema,
  getPosts:  getPostsSchema,
  getTopic:  getTopicSchema,
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
   * Get forum posts.
   */
  fastify.get('/forum/posts/:topicId', getPostsSchema, async (request, reply) => {
    const topicId         = parseInt(request.params.topicId);
    const { limit, page } = request.query;
    const pageSize        = Math.max(1, Math.min(limit || 20, 100));

    let query = ForumPost.query()
      .eager('author')
      .where('forum_topic_id', topicId)
      .whereExists(ForumArea.query()
        .where({
          id:         ref('forum_area_id'),
          is_hidden:  false,
          is_private: fastify.auth.isAuthenticated ? ref('is_private') : false
        })
        .select(1)
      )
      .limit(pageSize)
      .orderBy('id', 'asc');

    if (page) {
      query = query.offset(pageSize * (page - 1));
    }

    const data = await query.select();

    return { data };
  });


  /**
   * Get forum topic.
   */
  fastify.get('/forum/topic/:topicId', getTopicSchema, async (request, reply) => {
    const topicId = parseInt(request.params.topicId);

    const topic = await ForumTopic.query()
      .eager('[author, forum_area]')
      .modifyEager('forum_area', builder => {
        builder.where({
          is_hidden: false,
          is_private: fastify.auth.isAuthenticated ? ref('is_private') : false,
        });
      })
      .findOne('id', topicId);

    if (!topic || !topic.forum_area) {
      return reply.notFound();
    }

    return { data: topic };
  });


  /**
   * Get forum topics.
   */
  fastify.get('/forum/topics', getTopicsSchema, async (request, reply) => {
    const { area, limit, page } = request.query;
    const pageSize = Math.max(1, Math.min(limit || 20, 100));

    // Accessible areas
    const areas = await ForumArea.query()
      .where({
        is_hidden:  false,
        is_private: fastify.auth.isAuthenticated ? ref('is_private') : false,
      })
      .pluck('id');

    if (!areas.length || (area && !areas.includes(area))) {
      return reply.notFound();
    }

    let query = ForumTopic.query()
      .eager('[author, last_post.author]')
      .orderBy('last_post_at', 'desc')
      .limit(pageSize);

    if (area) {
      query = query.where('forum_area_id', area);
    }
    else {
      query = query
        .whereIn('forum_area_id', areas)
        .mergeEager('forum_area');
    }

    if (page) {
      query = query.offset(pageSize * (page - 1));
    }

    const data = await query.select();

    return { data };
  });

};
