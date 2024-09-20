'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('diagram', 'data', {
      type: Sequelize.TEXT('long'),
      after: "name"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('diagram', 'data');
  }
};
