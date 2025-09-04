'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('os_file', 'at_moment', {
      type: Sequelize.STRING,
      values: ['start', 'end']
    })
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os_file', 'at_moment')
    ])
  }
};
