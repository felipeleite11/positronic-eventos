'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('person', 'company_id', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'person'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('person', 'company_id')
  }
};
