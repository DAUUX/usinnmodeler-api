'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('favorite', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'user'
          },
          key: 'id'
        },
        allowNull: false,
        comment: 'User id'
      },
      diagram_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'diagram'
          },
          key: 'id'
        },
        allowNull: false,
        comment: 'favorited diagram id'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('favorite');
  }
};
