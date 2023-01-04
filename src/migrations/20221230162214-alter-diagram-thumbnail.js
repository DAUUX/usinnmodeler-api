'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('diagram', 'diagram_svg', {
      type: Sequelize.STRING(100),
      after: "diagram_data",
      comment: "Imagem do diagrama"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('diagram', 'diagram_svg');
  }
};
