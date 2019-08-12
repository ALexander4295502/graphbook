import Sequelize from 'sequelize';
import CONFIG from '../../../config.json';

const sequelize = new Sequelize(
  'graphbook_dev',
  CONFIG.MySql.USERNAME,
  CONFIG.MySql.PASSWORD,
  {
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
);

export default sequelize;
