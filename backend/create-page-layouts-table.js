require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  let connection;
  
  try {
    console.log('Iniciando o script...');
    
    // Configurações do banco de dados
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'risada_news_hub'
    };
    
    console.log('Configurações do banco de dados:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });

    // Criar conexão com o banco de dados
    console.log('Tentando conectar ao banco de dados...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Conectado ao banco de dados com sucesso!');

    // Verificar se a tabela já existe
    console.log('Verificando se a tabela page_layouts existe...');
    const [tables] = await connection.query(
      'SHOW TABLES LIKE "page_layouts"'
    );

    if (tables.length === 0) {
      console.log('Tabela page_layouts não encontrada. Criando tabela...');
      
      // Criar a tabela page_layouts
      await connection.query(`
        CREATE TABLE page_layouts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          layout JSON NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT FALSE,
          created_by INT,
          updated_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      
      console.log('Tabela page_layouts criada com sucesso!');
      
      // Criar layout padrão
      console.log('Criando layout padrão...');
      await connection.query(`
        INSERT INTO page_layouts (name, layout, is_active, created_by)
        VALUES (
          'Layout Padrão', 
          '[{"type":"grid","settings":{"columns":3}}]', 
          TRUE, 
          (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
        );
      `);
      
      console.log('Layout padrão criado com sucesso!');
    } else {
      console.log('Tabela page_layouts já existe.');
    }

    console.log('Processo finalizado com sucesso!');
  } catch (error) {
    console.error('Erro durante a execução do script:');
    console.error(error);
    
    if (error.message && error.message.includes("Unknown database")) {
      console.error('O banco de dados não existe. Crie o banco de dados primeiro.');
    } else if (error.message && error.message.includes("Access denied")) {
      console.error('Erro de acesso ao banco de dados. Verifique suas credenciais.');
    } else if (error.message && error.message.includes("ECONNREFUSED")) {
      console.error('Não foi possível conectar ao servidor MySQL. Verifique se o MySQL está rodando.');
    }
  } finally {
    if (connection) {
      console.log('Fechando conexão com o banco de dados...');
      await connection.end();
      console.log('Conexão fechada.');
    }
  }
}

main(); 