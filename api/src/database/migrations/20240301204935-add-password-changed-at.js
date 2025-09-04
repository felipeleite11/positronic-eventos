'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('user', 'password_changed_at', {
      type: Sequelize.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('user', 'password_changed_at')
  }
};
