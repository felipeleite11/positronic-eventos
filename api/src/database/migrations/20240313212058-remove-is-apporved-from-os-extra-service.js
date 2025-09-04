'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os_extra_service', 'is_approved'),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('os_extra_service', 'is_approved', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      })
    ])
  }
};
