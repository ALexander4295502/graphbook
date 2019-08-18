'use strict';
module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('Posts', [
      {
        text: 'Lorem ipsum 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        text: 'Lorem ipsum2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Posts', null, {});
  },
};
