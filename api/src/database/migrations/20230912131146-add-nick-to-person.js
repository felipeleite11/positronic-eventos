'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('person', 'nick', {
      type: Sequelize.STRING      
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('person', 'nick')
  }
};



