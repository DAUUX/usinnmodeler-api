'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'avatar', {
      type: Sequelize.INTEGER,
      after: "role",
      comment: "Imagem do avatar do usuário"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'avatar');
  }
};