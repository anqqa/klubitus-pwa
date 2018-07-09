const merge = require('lodash').merge;

const { ForumArea }  = require('../models/ForumArea');
const { ForumPost }  = require('../models/ForumPost');
const { ForumTopic } = require('../models/ForumTopic');
const { ForumUser }  = require('../models/ForumUser');


const getAreas = {
  schema: {
    response: {
      200: {
        type:       'object',
        properties: {
          data: {
            type:  'array',
            items: merge({}, ForumArea.jsonSchema, { properties: {
              last_topic: { anyOf: [{ type: 'null' }, ForumTopic.jsonSchema] }
            } }),
          },
        },
      },
    },
  },
};


const author = { anyOf: [{ type: 'null' }, ForumUser.jsonSchema] };

const getPosts = {
  schema: {
    params:   {
      type:       'object',
      required:   ['topicId'],
      properties: { topicId: { type: 'integer' } },
    },
    querystring: {
      limit: { type: 'integer' },
      page:  { type: 'integer' },
    },
    response: {
      200: {
        type:       'object',
        properties: {
          data: {
            type:  'array',
            items: merge({}, ForumPost.jsonSchema, { properties: { author } }),
          },
        },
      },
    },
  },
};


const topic = merge({}, ForumTopic.jsonSchema, { properties: {
  author,
  forum_area:  ForumArea.jsonSchema,
  // last_poster: { anyOf: [User.jsonSchema, { type: 'null' }]},
} });

const getTopic = {
  schema: {
    params:   {
      type:       'object',
      required:   ['topicId'],
      properties: { topicId: { type: 'integer' } },
    },
    querystring: {
      limit: { type: 'integer' },
      page:  { type: 'integer' },
    },
    response: {
      200: {
        type:       'object',
        properties: { data: topic },
      },
    },
  },
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
        properties: { data: { type: 'array', items: topic } },
      },
    },
  },
};


module.exports = {
  getAreas,
  getPosts,
  getTopic,
  getTopics,
};
