'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('os_execution', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      os_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'os',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'service',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      step_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'service_step',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'resource',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      dimension_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'resource_dimension',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      dimension: {
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
    queryInterface.dropTable('os_execution')
  }
};
