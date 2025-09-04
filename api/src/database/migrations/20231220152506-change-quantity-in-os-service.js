'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os_service', 'quantity'),

      queryInterface.addColumn('os_service', 'requested_quantity', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os_service', 'requested_quantity'),

      queryInterface.addColumn('os_service', 'quantity', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    ])
  }
};
