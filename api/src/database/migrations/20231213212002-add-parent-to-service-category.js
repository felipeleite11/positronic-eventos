'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('service_category', 'parent_id', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'service_category'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('service_category', 'parent_id')
    ])
  }
};
