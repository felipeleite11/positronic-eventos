'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('contract', 'term_number', {
      type: Sequelize.INTEGER
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('contract', 'term_number')
  }
};
