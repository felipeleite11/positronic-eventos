'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('os', 'start', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('os', 'end', {
        type: Sequelize.STRING
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os', 'start'),
      queryInterface.removeColumn('os', 'end')
    ])
  }
};
