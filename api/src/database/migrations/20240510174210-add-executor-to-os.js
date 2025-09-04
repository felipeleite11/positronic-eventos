'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'executor_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'person',
        key: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('os', 'executor_id')
  }
};
