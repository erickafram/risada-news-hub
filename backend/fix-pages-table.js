const mysql = require('mysql2/promise');

async function updatePagesTable() {
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
    
    // Verificar se a tabela pages existe
    const [tables] = await connection.query(`
      SHOW TABLES LIKE 'pages'
    `);
    
    if (tables.length === 0) {
      console.log('A tabela pages não existe. Criando...');
      
      // Criar a tabela pages com todos os campos necessários
      await connection.query(`
        CREATE TABLE pages (
          id INT NOT NULL AUTO_INCREMENT,
          title VARCHAR(100) NOT NULL,
          slug VARCHAR(100) NOT NULL UNIQUE,
          content LONGTEXT NOT NULL,
          meta_title VARCHAR(100) NULL,
          meta_description VARCHAR(255) NULL,
          featured_image VARCHAR(255) NULL,
          status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
          show_in_menu BOOLEAN NOT NULL DEFAULT FALSE,
          menu_order INT NOT NULL DEFAULT 0,
          author_id INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('Tabela pages criada com sucesso!');
    } else {
      console.log('A tabela pages já existe. Verificando estrutura...');
      
      // Obter a estrutura atual da tabela
      const [columns] = await connection.query(`
        SHOW COLUMNS FROM pages
      `);
      
      // Mapear os nomes das colunas existentes
      const existingColumns = columns.map(col => col.Field);
      console.log('Colunas existentes:', existingColumns.join(', '));
      
      // Verificar e adicionar colunas que estão faltando
      if (!existingColumns.includes('show_in_menu')) {
        console.log('Adicionando coluna show_in_menu...');
        await connection.query(`
          ALTER TABLE pages ADD COLUMN show_in_menu BOOLEAN NOT NULL DEFAULT FALSE
        `);
      }
      
      if (!existingColumns.includes('menu_order')) {
        console.log('Adicionando coluna menu_order...');
        await connection.query(`
          ALTER TABLE pages ADD COLUMN menu_order INT NOT NULL DEFAULT 0
        `);
      }
      
      if (!existingColumns.includes('meta_title')) {
        console.log('Adicionando coluna meta_title...');
        await connection.query(`
          ALTER TABLE pages ADD COLUMN meta_title VARCHAR(100) NULL
        `);
      }
      
      if (!existingColumns.includes('meta_description')) {
        console.log('Adicionando coluna meta_description...');
        await connection.query(`
          ALTER TABLE pages ADD COLUMN meta_description VARCHAR(255) NULL
        `);
      }
      
      console.log('Estrutura da tabela pages atualizada com sucesso!');
    }
    
    // Criar uma página de exemplo se não existir nenhuma
    const [pageCount] = await connection.query(`
      SELECT COUNT(*) as count FROM pages
    `);
    
    if (pageCount[0].count === 0) {
      console.log('Nenhuma página encontrada. Criando página de exemplo...');
      
      await connection.query(`
        INSERT INTO pages (title, slug, content, status, meta_title, meta_description, show_in_menu, menu_order)
        VALUES (
          'Página Inicial',
          'pagina-inicial',
          '<h1>Bem-vindo ao Risada News Hub</h1><p>Este é o seu portal de notícias e entretenimento.</p>',
          'published',
          'Página Inicial - Risada News Hub',
          'Portal de notícias e entretenimento',
          TRUE,
          1
        )
      `);
      
      await connection.query(`
        INSERT INTO pages (title, slug, content, status, meta_title, meta_description, show_in_menu, menu_order)
        VALUES (
          'Sobre Nós',
          'sobre-nos',
          '<h1>Sobre o Risada News Hub</h1><p>Somos um portal dedicado a trazer as melhores notícias e conteúdos.</p>',
          'published',
          'Sobre Nós - Risada News Hub',
          'Conheça mais sobre o Risada News Hub',
          TRUE,
          2
        )
      `);
      
      console.log('Páginas de exemplo criadas com sucesso!');
    } else {
      console.log(`${pageCount[0].count} páginas já existem no banco de dados.`);
    }
    
  } catch (error) {
    console.error('Erro durante a atualização da tabela pages:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão encerrada');
    }
  }
}

updatePagesTable(); 