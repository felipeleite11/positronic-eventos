'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('contract', 'state', {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn('contract', 'city', {
        type: Sequelize.STRING
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return new Promise.all([
      queryInterface.removeColumn('contract', 'state'),

      queryInterface.removeColumn('contract', 'city')
    ])
  }
};
