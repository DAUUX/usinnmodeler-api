'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('collaboration', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      collaborator_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'user'
          },
          key: 'id'
        },
        allowNull: false,
        comment: 'User collaborator id'
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
        comment: 'Shared diagram id'
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
    await queryInterface.dropTable('collaboration');
  }
};
