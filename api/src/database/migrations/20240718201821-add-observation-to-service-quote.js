'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('service_quote', 'formula_observation', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('service_quote', 'formula_observation')
  }
};
