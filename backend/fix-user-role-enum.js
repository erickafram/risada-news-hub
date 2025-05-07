const mysql = require('mysql2/promise');

async function updateRoles() {
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
    
    // 1. Alterar a coluna role para aceitar qualquer string temporariamente
    console.log('Alterando coluna role para tipo VARCHAR...');
    await connection.query(`
      ALTER TABLE users MODIFY role VARCHAR(50) NOT NULL DEFAULT 'subscriber'
    `);
    
    // 2. Atualizar os valores existentes (converter 'reader' para 'subscriber')
    console.log('Atualizando roles reader para subscriber...');
    const [updateResult] = await connection.query(`
      UPDATE users SET role = 'subscriber' WHERE role = 'reader'
    `);
    console.log(`${updateResult.affectedRows} usuários atualizados de 'reader' para 'subscriber'`);
    
    // 3. Criar o novo ENUM type
    console.log('Alterando coluna role para o novo ENUM...');
    await connection.query(`
      ALTER TABLE users MODIFY role ENUM('admin', 'editor', 'author', 'subscriber') NOT NULL DEFAULT 'subscriber'
    `);
    
    console.log('Atualização concluída com sucesso!');
    
    // Verificar a estrutura atualizada
    const [fields] = await connection.query('DESCRIBE users role');
    console.log('Nova estrutura da coluna role:', fields);
    
    // Verificar a definição da tabela
    const [tableDefinition] = await connection.query('SHOW CREATE TABLE users');
    console.log('Nova definição da tabela users:');
    console.log(tableDefinition[0]['Create Table']);
    
  } catch (error) {
    console.error('Erro durante a atualização:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão encerrada');
    }
  }
}

updateRoles(); 