const mysql = require('mysql2');

// Criar conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'risada_news_hub'
});

// Adicionar a coluna last_login
connection.query('ALTER TABLE users ADD COLUMN last_login DATETIME NULL', (err, results) => {
  if (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('A coluna last_login já existe na tabela users.');
    } else {
      console.error('Erro ao adicionar a coluna last_login:', err);
    }
  } else {
    console.log('Coluna last_login adicionada com sucesso!');
  }
  
  // Fechar a conexão
  connection.end();
}); 