'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'gender', {
      type: Sequelize.INTEGER(1),
      after: "birthday",
      comment: "1:Feminino | 2:Masculino | 3:Prefiro não informar"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'gender');
  }
};
