// Update with your config settings.
require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection:  process.env.DATABASE_URL || 'postgresql://postgres@localhost/atomic',
    seeds: {
      directory: "./seeds/",
    },
  },

  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password",
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },
};
