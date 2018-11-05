const merge = require('lodash').merge;

const { ForumArea }  = require('../models/ForumArea');
const { ForumPost }  = require('../models/ForumPost');
const { ForumTopic } = require('../models/ForumTopic');
const { ForumUser }  = require('../models/ForumUser');


const getAreas = {
  schema: {
    querystring: {
      details: { type: 'boolean' }
    },
    response: {
      200: {
        type:       'object',
        properties: { data: { type: 'array', items: ForumArea.getCombinedJsonSchema() } },
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
        properties: { data: ForumTopic.getCombinedJsonSchema() },
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
        properties: { data: { type: 'array', items: ForumTopic.getCombinedJsonSchema() } },
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
