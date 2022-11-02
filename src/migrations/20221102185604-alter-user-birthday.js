'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'birthday', {
      type: Sequelize.DATEONLY,
      after: "role"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'birthday');
  }
};