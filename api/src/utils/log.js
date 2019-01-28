const log = require('pino')({
  level:       'trace',
  prettyPrint: { levelFirst: true },
});


module.exports = log;
