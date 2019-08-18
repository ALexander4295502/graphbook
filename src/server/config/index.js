// Sequalize db migrate doesn't support import(ES6) syntax here
// using require instead
const CONFIG = require('../../../config.json');

module.exports = {
  development: {
    username: CONFIG.MySql.USERNAME,
    password: CONFIG.MySql.PASSWORD,
    database: 'graphbook_dev',
    host: 'localhost',
    dialect: 'mysql',
    operatosAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    host: process.env.host,
    username: process.env.username,
    password: process.env.password,
    database: process.env.database,
    logging: false,
    dialect: 'mysql',
    operatosAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
