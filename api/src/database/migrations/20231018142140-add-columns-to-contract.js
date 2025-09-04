'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('contract', 'total_value', {
        type: Sequelize.DECIMAL(10, 2)
      }),
      queryInterface.addColumn('contract', 'object', {
        type: Sequelize.STRING(2000)
      })
    ])
    
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('contract', 'total_value'),
      queryInterface.removeColumn('contract', 'object')
    ])
  }
};



