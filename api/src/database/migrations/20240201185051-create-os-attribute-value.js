'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('os_attribute_value', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      attribute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'os_attribute',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      attribute_option_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'os_attribute_option',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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
      value: {
        type: Sequelize.STRING
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
    queryInterface.dropTable('os_attribute_value')
  }
};
