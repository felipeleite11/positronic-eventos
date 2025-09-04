'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'status_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'os_status',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('os', 'status_id')
  }
};
