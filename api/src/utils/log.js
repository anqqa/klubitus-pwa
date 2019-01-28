const log = require('pino')({
  logger: {
    level:       'trace',
    prettyPrint: { levelFirst: true },
  },
});


module.exports = log;
