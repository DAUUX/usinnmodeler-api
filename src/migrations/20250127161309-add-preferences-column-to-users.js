'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'preferences', {
      type: Sequelize.JSON,
      allowNull: true, // Permite valores nulos inicialmente
      defaultValue: null, // Define o valor padrão como null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'preferences');
  },
};
