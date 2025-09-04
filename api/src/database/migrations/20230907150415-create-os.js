'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('os', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'address',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      creator_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'person',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      company_executor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'person',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      executor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'person',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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
      execution_assignment_date: {
        type: Sequelize.DATE
      },
      execution_start: {
        type: Sequelize.DATE
      },
      execution_end: {
        type: Sequelize.DATE
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
    queryInterface.dropTable('os')
  }
};
