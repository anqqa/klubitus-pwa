'use strict';

const _user = {
  type:       'object',
  properties: {
    id:       { type: 'integer' },
    username: { type: 'string' },
  },
  require: ['id', 'username']
};


const postLogin = {
  schema: {
    body:   {
      type:       'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required:   ['username', 'password'],
    },
    response: {
      200: {
        type:       'object',
        properties: {
          token: { type: 'string' },
        }
      },
    }
  }
};


module.exports = {
  postLogin,
};
