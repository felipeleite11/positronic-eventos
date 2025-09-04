'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os_attribute', 'type', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('os_attribute', 'type')
  }
};
