const { ForumArea } = require('../models/forumarea');
const { ForumTopic } = require('../models/forumtopic');
const { User } = require('../models/user');


const getAreas = {
  schema: {
    response: {
      200: {
        type:       'object',
        properties: {
          data: {
            type:  'array',
            items: ForumArea.jsonSchema,
          },
        },
      },
    },
  },
};


const topicNestedProperties = {
  author:      User.jsonSchema,
  forum_area:  ForumArea.jsonSchema,
  last_poster: User.jsonSchema,
};

const getTopics = {
  schema: {
    response: {
      200: {
        type:       'object',
        properties: {
          data: {
            type:  'array',
            items: {
              type:       'object',
              properties: Object.assign({}, ForumTopic.jsonSchema.properties, topicNestedProperties),
            },
          },
        },
      },
    },
  },
};


module.exports = {
  getAreas,
  getTopics,
  topicNestedProperties,
};
