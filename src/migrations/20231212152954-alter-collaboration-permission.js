'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('collaboration', 'permission', {
      type: Sequelize.INTEGER(1),
      after: "diagram_id",
      comment: "1:Leitor | 2:Editor "
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('collaboration', 'permission');
  }
};