const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = require('./env');

module.exports = {
  [process.env.NODE_ENV]: {
    client: 'pg',
    connection: {
      host: PGHOST,
      database: PGDATABASE,
      user: PGUSER,
      password: PGPASSWORD,
      "port": 5433,
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: `./db/seeds`
    },
    "production": {
      "client": "pg",
      "connection": process.env.DATABASE_URL
      }
  }
};
