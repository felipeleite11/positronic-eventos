'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'execution_assignment_date', {
      type: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('os', 'execution_assignment_date')
  }
};
