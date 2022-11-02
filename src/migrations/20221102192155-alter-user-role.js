'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'role', {
      type: Sequelize.INTEGER(1),
      allowNull: true,
      comment: "1: Estudante | 2: Pesquisador | 3:Profissional"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'role', {
      type: Sequelize.STRING(100),
      allowNull: true,
    })
  }
};
