'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os_attribute_value', 'attribute_field_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'os_attribute_field',
        key: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('os_attribute_value', 'attribute_field_id')
  }
};
