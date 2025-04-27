require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Setting } = require('./src/models');

async function addColorSettings() {
  try {
    console.log('Iniciando adição de configurações de cores...');

    // Novas configurações de cores para o header e footer
    const colorSettings = [
      {
        key: 'header_start_color',
        value: '#9333ea', // purple-600
        group: 'appearance',
        description: 'Cor inicial do gradiente do cabeçalho',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'header_end_color',
        value: '#db2777', // pink-600
        group: 'appearance',
        description: 'Cor final do gradiente do cabeçalho',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'footer_start_color',
        value: '#9333ea', // purple-600
        group: 'appearance',
        description: 'Cor inicial do gradiente do rodapé',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'footer_end_color',
        value: '#db2777', // pink-600
        group: 'appearance',
        description: 'Cor final do gradiente do rodapé',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Verificar se as configurações já existem
    for (const setting of colorSettings) {
      const existingSetting = await Setting.findOne({ where: { key: setting.key } });
      
      if (existingSetting) {
        console.log(`Configuração ${setting.key} já existe. Atualizando...`);
        await existingSetting.update(setting);
      } else {
        console.log(`Adicionando nova configuração: ${setting.key}`);
        await Setting.create(setting);
      }
    }

    console.log('Configurações de cores adicionadas com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar configurações de cores:', error);
  } finally {
    process.exit(0);
  }
}

addColorSettings();
