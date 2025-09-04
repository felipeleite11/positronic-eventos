'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('os_execution', 'start', {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn('os_execution', 'end', {
        type: Sequelize.DATE
      })
    ])
    
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os_execution', 'start'),
      queryInterface.removeColumn('os_execution', 'end')
    ])
  }
};



