const mysql = require('mysql2/promise');

async function updateCommentsTable() {
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
    
    // Verificar se a coluna status existe na tabela comments
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM comments LIKE 'status'
    `);
    
    if (columns.length === 0) {
      console.log('Adicionando coluna status à tabela comments...');
      
      // Adicionar a coluna status
      await connection.query(`
        ALTER TABLE comments 
        ADD COLUMN status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
      `);
      
      console.log('Coluna status adicionada com sucesso!');
    } else {
      console.log('A coluna status já existe na tabela comments.');
    }
    
    // Verificar a estrutura da tabela pages
    try {
      const [pagesTable] = await connection.query(`
        SHOW TABLES LIKE 'pages'
      `);
      
      if (pagesTable.length > 0) {
        console.log('A tabela pages existe. Verificando sua estrutura...');
        
        // Mostrar a estrutura da tabela pages
        const [pageColumns] = await connection.query(`
          SHOW COLUMNS FROM pages
        `);
        
        console.log('Estrutura da tabela pages:');
        pageColumns.forEach(column => {
          console.log(`- ${column.Field}: ${column.Type}`);
        });
      } else {
        console.log('A tabela pages não existe. Criando...');
        
        // Criar a tabela pages
        await connection.query(`
          CREATE TABLE pages (
            id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            content LONGTEXT,
            status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
            author_id INT,
            featured_image VARCHAR(255),
            meta_title VARCHAR(255),
            meta_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('Tabela pages criada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao verificar a tabela pages:', error);
    }
    
  } catch (error) {
    console.error('Erro durante a atualização:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão encerrada');
    }
  }
}

updateCommentsTable(); 