const knex = require('knex');

module.exports = function () {
  const app                    = this;
  const { client, connection } = app.get('postgres');
  const db                     = knex({
    client,
    connection,
    pool: {
      afterCreate: (conn, callback) => {
        conn.query('SET timezone = "Europe/Helsinki";', (error) => {
          callback(error, conn);
        });
      },
    },
  });

  app.set('knexClient', db);
};
