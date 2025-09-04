'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('person', 'address_id', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'address'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('person', 'address_id')
  }
};
