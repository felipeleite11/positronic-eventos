'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('service_quote', 'formula_creator_id', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'person'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('service_quote', 'formula_creator_id')
  }
};
