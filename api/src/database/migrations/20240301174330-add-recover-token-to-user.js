'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('user', 'recover_token', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('user', 'recover_token')
  }
};
