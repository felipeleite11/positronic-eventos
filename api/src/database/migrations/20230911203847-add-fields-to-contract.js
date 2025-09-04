'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('contract', 'sign_date', {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn('contract', 'measurement_start', {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn('contract', 'measurement_days', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('contract', 'measurement_day', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('contract', 'invoicing_day', {
        type: Sequelize.INTEGER
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('contract', 'sign_date'),
      queryInterface.removeColumn('contract', 'measurement_start'),
      queryInterface.removeColumn('contract', 'measurement_days'),
      queryInterface.removeColumn('contract', 'measurement_day'),
      queryInterface.removeColumn('contract', 'invoicing_day')
    ])
  }
};



