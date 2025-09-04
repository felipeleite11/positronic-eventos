'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('service_quote', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'service',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0.0
      },
      consumed: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0.0
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      warn_value: {
        type: Sequelize.DECIMAL
      },
      price_by_unit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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
    queryInterface.dropTable('service_quote')
  }
};
