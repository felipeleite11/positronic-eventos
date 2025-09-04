'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('resource', 'category_id', {
      type: Sequelize.INTEGER,

      references: {
        model: 'resource_category',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('resource', 'category_id')
  }
};



