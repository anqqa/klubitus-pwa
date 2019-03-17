const axios = require('axios');

const log = require('../utils/log');

const graphAPI = axios.create({
  baseURL: 'https://graph.facebook.com',
});

graphAPI.interceptors.request.use(config => {
  const { url, method } = config;

  log.info(`[FB]: Sending ${method.toUpperCase()} request to ${url}`);

  return config;
});

graphAPI.interceptors.response.use(
  response => {
    const { config, status, statusText, data } = response;

    log.info(`[FB]: Response from ${config.url}: ${status}:${statusText}`, { data });

    return response;
  },
  error => {
    const { config, response } = error;
    const { status, statusText, data } = response;
    const { message, type, code } = data.error;

    log.warn(`[FB]: Request to ${config.url} failed: ${status}:${statusText}`, {
      message,
      type,
      code,
    });

    return Promise.reject(data.error);
  }
);

async function me(access_token, fields = ['id']) {
  const response = await graphAPI.get('/me', {
    params: { fields: fields.join(','), access_token },
  });

  return response.data;
}

module.exports = {
  me,
};
