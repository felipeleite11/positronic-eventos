'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('service_step', 'resource_category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'resource_category',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('service_step', 'resource_category_id')
  }
};



