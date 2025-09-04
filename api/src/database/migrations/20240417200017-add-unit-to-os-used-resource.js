'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os_used_resource', 'unit_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'unit',
        key: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('os_used_resource', 'unit_id')
  }
};
