'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('os_execution'),
      queryInterface.dropTable('service_step')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
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
      }),

      queryInterface.createTable('service_step', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
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
    ])
  }
};
