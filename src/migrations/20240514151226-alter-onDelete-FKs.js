'use strict';
// Muda o OnDelete para cascade, assim quando uma conta for excluída, seus diagramas também são
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      //*tabela diagram
        // Altera a chave estrangeira existente na tabela diagram, user_id
        await queryInterface.sequelize.query('ALTER TABLE diagram DROP FOREIGN KEY diagram_ibfk_1;');
        await queryInterface.sequelize.query('ALTER TABLE diagram ADD CONSTRAINT diagram_ibfk_1 FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE;');

      //*tabela favorite  
        // Altera a chave estrangeira existente na tabela favorite, user_id
        await queryInterface.sequelize.query('ALTER TABLE favorite DROP FOREIGN KEY favorite_ibfk_1;');
        await queryInterface.sequelize.query('ALTER TABLE favorite ADD CONSTRAINT favorite_ibfk_1 FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE;');
        // Altera a chave estrangeira existente na tabela favorite, diagram_id
        await queryInterface.sequelize.query('ALTER TABLE favorite DROP FOREIGN KEY favorite_ibfk_2;');
        await queryInterface.sequelize.query('ALTER TABLE favorite ADD CONSTRAINT favorite_ibfk_2 FOREIGN KEY (diagram_id) REFERENCES diagram(id) ON DELETE CASCADE;');

      //*tabela collaboration
        // Altera a chave estrangeira existente na tabela collaboration, collaborator_id
        await queryInterface.sequelize.query('ALTER TABLE collaboration DROP FOREIGN KEY collaboration_ibfk_1;');
        await queryInterface.sequelize.query('ALTER TABLE collaboration ADD CONSTRAINT collaboration_ibfk_1 FOREIGN KEY (collaborator_id) REFERENCES user(id) ON DELETE CASCADE;');
        // Altera a chave estrangeira existente na tabela collaboration, diagram_id
        await queryInterface.sequelize.query('ALTER TABLE collaboration DROP FOREIGN KEY collaboration_ibfk_2;');
        await queryInterface.sequelize.query('ALTER TABLE collaboration ADD CONSTRAINT collaboration_ibfk_2 FOREIGN KEY (diagram_id) REFERENCES diagram(id) ON DELETE CASCADE;');
      
      //*tabela share_token
        // Altera a chave estrangeira existente na tabela share_token, diagram_id
        await queryInterface.sequelize.query('ALTER TABLE share_token DROP FOREIGN KEY share_token_ibfk_1;');
        await queryInterface.sequelize.query('ALTER TABLE share_token ADD CONSTRAINT share_token_ibfk_1 FOREIGN KEY (diagram_id) REFERENCES diagram(id) ON DELETE CASCADE;');

      //*tabela recover_token
        // Altera a chave estrangeira existente na tabela recover_token, user_id
        await queryInterface.sequelize.query('ALTER TABLE recover_token DROP FOREIGN KEY recover_token_ibfk_1;');
        await queryInterface.sequelize.query('ALTER TABLE recover_token ADD CONSTRAINT recover_token_ibfk_1 FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE;');
    } catch (error) {
      console.error('Error updating foreign keys ON DELETE:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    //? Comandos de revertimento aqui, se necessário
  }
};
