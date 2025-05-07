const mysql = require('mysql2/promise');

async function addMissingColumns() {
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
    
    // Verificar colunas da tabela pages
    const [columns] = await connection.query('DESCRIBE pages');
    const existingColumns = columns.map(col => col.Field);
    
    console.log('Colunas existentes na tabela pages:', existingColumns.join(', '));
    
    // Adicionar as colunas faltantes
    if (!existingColumns.includes('updated_at')) {
      console.log('Adicionando coluna updated_at...');
      await connection.query(`
        ALTER TABLE pages 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('Coluna updated_at adicionada com sucesso!');
    }
    
    if (!existingColumns.includes('show_in_menu')) {
      console.log('Adicionando coluna show_in_menu...');
      await connection.query(`
        ALTER TABLE pages 
        ADD COLUMN show_in_menu BOOLEAN NOT NULL DEFAULT FALSE
      `);
      console.log('Coluna show_in_menu adicionada com sucesso!');
    }
    
    if (!existingColumns.includes('menu_order')) {
      console.log('Adicionando coluna menu_order...');
      await connection.query(`
        ALTER TABLE pages 
        ADD COLUMN menu_order INT NOT NULL DEFAULT 0
      `);
      console.log('Coluna menu_order adicionada com sucesso!');
    }
    
    // Verificar se há registros na tabela
    const [count] = await connection.query('SELECT COUNT(*) as count FROM pages');
    console.log(`Total de páginas existentes: ${count[0].count}`);
    
    if (count[0].count === 0) {
      console.log('Nenhuma página encontrada. Adicionando páginas de exemplo...');
      
      // Inserir páginas de exemplo
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
      
      console.log('Páginas de exemplo adicionadas com sucesso!');
    }
    
    // Verificar novamente a estrutura da tabela
    const [updatedColumns] = await connection.query('DESCRIBE pages');
    console.log('Estrutura final da tabela pages:');
    updatedColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type}`);
    });
    
  } catch (error) {
    console.error('Erro durante a execução do script:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão encerrada');
    }
  }
}

addMissingColumns(); 