const { ForumArea } = require('../models/ForumArea');
const { ForumTopic } = require('../models/ForumTopic');
const { User } = require('../models/User');


const areaNestedProperties = {
  last_topic: { anyOf: [{ type: 'null' }, ForumTopic.jsonSchema]},
  // last_topic: ForumTopic.jsonSchema,
};

const getAreas = {
  schema: {
    response: {
      200: {
        type:       'object',
        properties: {
          data: {
            type:  'array',
            items: {
              type:       'object',
              properties: Object.assign({}, ForumArea.jsonSchema.properties, areaNestedProperties),
            },
          },
        },
      },
    },
  },
};


const topicNestedProperties = {
  author:      { anyOf: [{ type: 'null' }, User.jsonSchema]},
  forum_area:  ForumArea.jsonSchema,
  // last_poster: { anyOf: [User.jsonSchema, { type: 'null' }]},
};

const getTopics = {
  schema: {
    querystring: {
      area:  { type: 'integer' },
      limit: { type: 'integer' },
      page:  { type: 'integer' },
    },
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
};
