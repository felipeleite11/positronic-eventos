'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('os', 'observation', {
      type: Sequelize.TEXT
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('os', 'observation')
  }
};



