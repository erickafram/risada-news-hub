const mysql = require('mysql2/promise');

async function createSettingsTable() {
  let connection;
  
  try {
    // Criar conexão com o banco de dados
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'risada_news_hub'
    });
    
    console.log('Conexão estabelecida');
    
    // Verificar se a tabela settings existe
    const [tables] = await connection.query(`
      SHOW TABLES LIKE 'settings'
    `);
    
    if (tables.length === 0) {
      console.log('Tabela settings não existe. Criando...');
      
      // Criar a tabela settings
      await connection.query(`
        CREATE TABLE settings (
          id INT NOT NULL AUTO_INCREMENT,
          \`group\` VARCHAR(50) NOT NULL,
          \`key\` VARCHAR(50) NOT NULL,
          value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY \`group_key\` (\`group\`, \`key\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('Tabela settings criada com sucesso!');
      
      // Inserir configurações padrão
      console.log('Inserindo configurações padrão...');
      
      const defaultSettings = [
        // Grupo appearance
        { group: 'appearance', key: 'theme', value: 'light' },
        { group: 'appearance', key: 'primary_color', value: '#3b82f6' },
        { group: 'appearance', key: 'primary_text_color', value: '#ffffff' },
        { group: 'appearance', key: 'content_text_color', value: '#1f2937' },
        { group: 'appearance', key: 'logo_url', value: '/uploads/logo.png' },
        { group: 'appearance', key: 'favicon_url', value: '/uploads/favicon.ico' },
        
        // Grupo general
        { group: 'general', key: 'site_title', value: 'Meme PMW' },
        { group: 'general', key: 'site_description', value: 'Portal de notícias e entretenimento' },
        { group: 'general', key: 'site_url', value: 'https://risadanews.com.br' },
        { group: 'general', key: 'admin_email', value: 'admin@risadanews.com.br' },
        { group: 'general', key: 'language', value: 'pt-BR' },
        { group: 'general', key: 'timezone', value: 'America/Sao_Paulo' },
        
        // Grupo content
        { group: 'content', key: 'posts_per_page', value: '10' },
        { group: 'content', key: 'enable_comments', value: 'true' },
        { group: 'content', key: 'moderate_comments', value: 'true' },
        { group: 'content', key: 'enable_rss', value: 'true' },
        { group: 'content', key: 'enable_social_sharing', value: 'true' }
      ];
      
      for (const setting of defaultSettings) {
        await connection.query(`
          INSERT INTO settings (\`group\`, \`key\`, value)
          VALUES (?, ?, ?)
        `, [setting.group, setting.key, setting.value]);
      }
      
      console.log('Configurações padrão inseridas com sucesso!');
    } else {
      console.log('Tabela settings já existe.');
    }
    
  } catch (error) {
    console.error('Erro durante a criação da tabela settings:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão encerrada');
    }
  }
}

createSettingsTable(); 