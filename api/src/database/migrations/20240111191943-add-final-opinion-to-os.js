'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'final_opinion', {
      type: Sequelize.TEXT
    })
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os', 'final_opinion')
    ])
  }
};
