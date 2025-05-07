const mysql = require('mysql2');

// Criar conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'risada_news_hub'
});

// Mostrar a estrutura atual do campo role
connection.query('DESCRIBE users role', (err, results) => {
  if (err) {
    console.error('Erro ao verificar a estrutura da coluna role:', err);
    return connection.end();
  }

  console.log('Estrutura atual da coluna role:', results);

  // Atualizar usuários sem role para subscriber
  connection.query("UPDATE users SET role = 'subscriber' WHERE role IS NULL OR role = ''", (err, results) => {
    if (err) {
      console.error('Erro ao atualizar usuários sem role:', err);
    } else {
      console.log(`${results.affectedRows} usuários atualizados para role='subscriber'`);
    }

    // Verificar se o valor padrão da coluna é subscriber
    connection.query("SHOW CREATE TABLE users", (err, results) => {
      if (err) {
        console.error('Erro ao verificar a definição da tabela:', err);
      } else {
        console.log('Definição da tabela users:');
        console.log(results[0]['Create Table']);
      }

      // Fechar a conexão
      connection.end();
    });
  });
}); 