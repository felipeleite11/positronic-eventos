'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('contract_service_load', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      contract_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'contract'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      lot_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'contract_lot'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'user'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      link: {
        type: Sequelize.STRING,
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

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('contract_service_load')
  }
};
