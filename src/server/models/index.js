/* eslint-disable global-require */
import Sequelize from 'sequelize';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line import/no-extraneous-dependencies
  require('babel-plugin-require-context-hook/register')();
}

export default sequelize => {
  const db = {};
  const context = require.context(
    '.',
    true,
    /^\.\/(?!index\.js).*\.js$/,
    'sync',
  );

  context
    .keys()
    .map(context)
    .forEach(module => {
      const model = module(sequelize, Sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
