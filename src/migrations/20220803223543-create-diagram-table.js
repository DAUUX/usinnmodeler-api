'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('diagram', {
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
        comment: 'Diagram owner id'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      diagram_data: {
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        comment: 'Diagram content'
      },
      is_shared: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
        comment: '0: Not shared/1: Shared'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('diagram');
  }
};
