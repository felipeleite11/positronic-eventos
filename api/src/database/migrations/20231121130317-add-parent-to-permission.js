'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('permission', 'parent_id', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'permission'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('permission', 'parent_id')
    ])
  }
};
