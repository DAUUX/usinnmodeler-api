'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'company', {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
          notNull: {
              msg: 'Preencha o campo organização'
          },
          notEmpty: {
              args: true,
              msg: 'Preencha o campo organização'
          }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'company', {
      type: Sequelize.STRING(255),
      allowNull: true,
      validate: {}
    })
  }
};
