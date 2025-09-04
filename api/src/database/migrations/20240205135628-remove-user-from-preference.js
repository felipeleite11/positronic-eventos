'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('preference', 'user_id'),
      queryInterface.removeColumn('preference', 'value')
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('preference', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          model: 'user'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),

      queryInterface.addColumn('preference', 'value', {
        type: Sequelize.STRING
      })
    ])
  }
};
