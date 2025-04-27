require('dotenv').config();
const { User } = require('./src/models');

async function fixUserRole() {
  try {
    console.log('Iniciando correção do papel do usuário...');
    
    // Buscar o usuário com ID 5
    const user = await User.findByPk(5);
    
    if (!user) {
      console.log('Usuário com ID 5 não encontrado.');
      return;
    }
    
    console.log('Usuário encontrado:', {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
    
    // Atualizar o papel para 'subscriber'
    await user.update({ role: 'subscriber' });
    
    console.log('Papel do usuário atualizado com sucesso para "subscriber"');
    
    // Verificar se a atualização foi bem-sucedida
    const updatedUser = await User.findByPk(5);
    console.log('Usuário após atualização:', {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role
    });
    
  } catch (error) {
    console.error('Erro ao atualizar o papel do usuário:', error);
  } finally {
    process.exit();
  }
}

fixUserRole();
