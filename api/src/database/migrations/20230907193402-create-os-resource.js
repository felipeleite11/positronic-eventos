'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('os_resource', {
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
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'resource',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      consumed: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0.0
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
    queryInterface.dropTable('os_resource')
  }
};
