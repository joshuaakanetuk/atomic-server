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
  production: {
    client: "postgresql",
    connection:  process.env.DATABASE_URL || 'postgresql://postgres@localhost/atomic',
    seeds: {
      directory: "./seeds/",
    },
  },
  testing: {
    client: "postgresql",
    connection:  process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/atomic-test',
    seeds: {
      directory: "./seeds/",
    },
  },
};
