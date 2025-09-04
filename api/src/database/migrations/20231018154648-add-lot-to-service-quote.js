'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('service_quote', 'lot_id', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'contract_lot'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('service_quote', 'lot_id')
  }
};



