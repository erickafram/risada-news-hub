require('dotenv').config();
const { User } = require('./src/models');

async function listUsers() {
  try {
    console.log('Listando todos os usuários...');
    
    // Buscar todos os usuários
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'active', 'createdAt']
    });
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado no banco de dados.');
      return;
    }
    
    console.log(`Total de usuários: ${users.length}`);
    
    // Exibir informações de cada usuário
    users.forEach(user => {
      console.log('-----------------------------------');
      console.log(`ID: ${user.id}`);
      console.log(`Nome: ${user.fullName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Papel: ${user.role}`);
      console.log(`Ativo: ${user.active ? 'Sim' : 'Não'}`);
      console.log(`Criado em: ${user.createdAt}`);
    });
    
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  } finally {
    process.exit();
  }
}

listUsers();
