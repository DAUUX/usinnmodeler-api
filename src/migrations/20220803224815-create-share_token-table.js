'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('share_token', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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
        comment: 'Diagram id'
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Token data'
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
    await queryInterface.dropTable('share_token');
  }
};
