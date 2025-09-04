'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'requester_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'person',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('os', 'requester_id')
  }
};



