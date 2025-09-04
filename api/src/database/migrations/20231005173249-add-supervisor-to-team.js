'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('team', 'supervisor_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'person',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('team', 'supervisor_id')
  }
};



