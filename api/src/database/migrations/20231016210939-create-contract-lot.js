'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('contract_lot', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      sequential: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      contract_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'contract',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('contract_lot')
  }
};
