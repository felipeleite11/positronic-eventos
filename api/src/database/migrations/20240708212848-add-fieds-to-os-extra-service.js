'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('os_extra_service', 'start', {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn('os_extra_service', 'end', {
        type: Sequelize.STRING
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os_extra_service', 'start'),
      queryInterface.removeColumn('os_extra_service', 'end')
    ])
  }
};
