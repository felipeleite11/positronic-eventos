'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('used_resource_value', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      value: {
        type: Sequelize.STRING
      },
      unit_field_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'unit_field',
          key: 'id'
        }
      },
      os_used_resource_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'os_used_resource',
          key: 'id'
        }
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
    queryInterface.dropTable('used_resource_value')
  }
};
