'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'finisher_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'person',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('os', 'finisher_id')
  }
};
