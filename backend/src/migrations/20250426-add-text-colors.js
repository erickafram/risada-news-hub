'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar se as colunas já existem
    const tableInfo = await queryInterface.describeTable('settings');
    
    const columnsToAdd = [];
    
    if (!tableInfo.primary_text_color) {
      columnsToAdd.push({
        name: 'primary_text_color',
        column: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '#ffffff'
        }
      });
    }
    
    if (!tableInfo.content_text_color) {
      columnsToAdd.push({
        name: 'content_text_color',
        column: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '#1f2937'
        }
      });
    }
    
    // Adicionar as colunas que não existem
    for (const column of columnsToAdd) {
      await queryInterface.addColumn('settings', column.name, column.column);
    }
    
    // Atualizar os registros existentes com os valores padrão
    if (columnsToAdd.length > 0) {
      await queryInterface.sequelize.query(`
        UPDATE settings 
        SET 
          primary_text_color = '#ffffff',
          content_text_color = '#1f2937'
        WHERE 
          primary_text_color IS NULL OR
          content_text_color IS NULL
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remover as colunas adicionadas
    await queryInterface.removeColumn('settings', 'primary_text_color');
    await queryInterface.removeColumn('settings', 'content_text_color');
  }
};
