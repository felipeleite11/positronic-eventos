'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('os', 'linked_os_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'os',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
      queryInterface.addColumn('os', 'contractor_os_number', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('os', 'requester_registration', {
        type: Sequelize.STRING
      })
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('os', 'linked_os_id'),

      queryInterface.removeColumn('os', 'contractor_os_number'),

      queryInterface.removeColumn('os', 'requester_registration')
    ])
  }
};
