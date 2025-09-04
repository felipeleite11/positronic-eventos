'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('preference', 'type', {
      type: Sequelize.STRING,
      defaultValue: 'text',
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('preference', 'type')
    ])
  }
};
