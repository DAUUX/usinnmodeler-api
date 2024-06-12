'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'birthday', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
          notNull: {
              msg: 'Preencha o campo data de nascimento'
          },
          notEmpty: {
              args: true,
              msg: 'Preencha o campo data de nascimento'
          }
      }
    });

    await queryInterface.changeColumn('user', 'gender', {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      validate: {
          notNull: {
              msg: 'Preencha o campo gênero'
          },
          min:1,
          max:3
      }
    });

    await queryInterface.changeColumn('user', 'role', {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      validate: {
        notNull: {
            msg: 'Preencha o campo perfil'
        },
        min:1,
        max:3
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('user', 'birthday', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      validate: {}
    });

    await queryInterface.changeColumn('user', 'gender', {
      type: Sequelize.INTEGER(1),
      allowNull: true,
      validate: {}
    });

    await queryInterface.changeColumn('user', 'role', {
      type: Sequelize.INTEGER(1),
      allowNull: true,
      validate: {}
    });
  }
};
