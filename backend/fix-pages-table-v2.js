const mysql = require('mysql2/promise');

async function fixPagesTable() {
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
    
    // Verificar todas as tabelas existentes
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tabelas existentes:', tables.map(t => Object.values(t)[0]).join(', '));
    
    // Verificar especificamente se a tabela pages existe
    const [pagesTable] = await connection.query('SHOW TABLES LIKE "pages"');
    
    if (pagesTable.length === 0) {
      console.log('A tabela "pages" não existe. Tentando criar...');
      
      try {
        // Tentar drop se existir (para garantir uma tabela limpa)
        await connection.query('DROP TABLE IF EXISTS pages');
        console.log('Tabela anterior removida (se existia)');
        
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
        
        // Criar páginas de exemplo
        await connection.query(`
          INSERT INTO pages (title, slug, content, status, meta_title, meta_description)
          VALUES (
            'Página Inicial',
            'pagina-inicial',
            '<h1>Bem-vindo ao Risada News Hub</h1><p>Este é o seu portal de notícias e entretenimento.</p>',
            'published',
            'Página Inicial - Risada News Hub',
            'Portal de notícias e entretenimento'
          )
        `);
        
        await connection.query(`
          INSERT INTO pages (title, slug, content, status, meta_title, meta_description)
          VALUES (
            'Sobre Nós',
            'sobre-nos',
            '<h1>Sobre o Risada News Hub</h1><p>Somos um portal dedicado a trazer as melhores notícias e conteúdos.</p>',
            'published',
            'Sobre Nós - Risada News Hub',
            'Conheça mais sobre o Risada News Hub'
          )
        `);
        
        console.log('Páginas de exemplo criadas com sucesso!');
      } catch (error) {
        console.error('Erro ao criar tabela pages:', error);
      }
    } else {
      console.log('A tabela "pages" já existe.');
      
      // Verificar estrutura da tabela
      const [columns] = await connection.query('DESCRIBE pages');
      console.log('Colunas da tabela pages:');
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type}`);
      });
      
      // Verificar se há registros
      const [count] = await connection.query('SELECT COUNT(*) as count FROM pages');
      console.log(`Total de páginas: ${count[0].count}`);
      
      if (count[0].count === 0) {
        console.log('Nenhuma página encontrada. Adicionando páginas de exemplo...');
        
        // Criar páginas de exemplo
        await connection.query(`
          INSERT INTO pages (title, slug, content, status, meta_title, meta_description)
          VALUES (
            'Página Inicial',
            'pagina-inicial',
            '<h1>Bem-vindo ao Risada News Hub</h1><p>Este é o seu portal de notícias e entretenimento.</p>',
            'published',
            'Página Inicial - Risada News Hub',
            'Portal de notícias e entretenimento'
          )
        `);
        
        await connection.query(`
          INSERT INTO pages (title, slug, content, status, meta_title, meta_description)
          VALUES (
            'Sobre Nós',
            'sobre-nos',
            '<h1>Sobre o Risada News Hub</h1><p>Somos um portal dedicado a trazer as melhores notícias e conteúdos.</p>',
            'published',
            'Sobre Nós - Risada News Hub',
            'Conheça mais sobre o Risada News Hub'
          )
        `);
        
        console.log('Páginas de exemplo criadas com sucesso!');
      }
    }
  } catch (error) {
    console.error('Erro durante a execução do script:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão encerrada');
    }
  }
}

fixPagesTable(); 