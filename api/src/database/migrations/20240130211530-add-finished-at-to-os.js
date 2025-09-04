'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'finished_at', {
      type: Sequelize.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('os', 'finished_at')
  }
};
