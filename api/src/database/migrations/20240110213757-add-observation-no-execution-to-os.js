'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'observation_no_execution', {
      type: Sequelize.TEXT
    })
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os', 'observation_no_execution')
    ])
  }
};
