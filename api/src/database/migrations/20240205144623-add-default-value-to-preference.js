'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('preference', 'default_value', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('preference', 'default_value')
  }
};
