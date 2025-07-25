'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notification', 'message_key', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('notification', 'message_variables', {
      type: Sequelize.JSON,
      allowNull: false,
    });

    await queryInterface.removeColumn('notification', 'message');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notification', 'message', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn('notification', 'message_key');
    await queryInterface.removeColumn('notification', 'message_variables');
  }
};
