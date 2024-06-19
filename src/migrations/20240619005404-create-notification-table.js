'use strict';

const { tableName } = require("../models/User");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notification', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'user'
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      diagram_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      diagram_name:{
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1: icon share / 2: icon pencil / 3: icon trash'
      },
      message: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      read: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        comment: '0: not read / 1: read'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('notification');
  }
};
