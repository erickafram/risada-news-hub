const { User } = require('../models');
const { UserReaction } = require('./reactionController');

// Listar todos os usuários (apenas para administradores)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

// Obter um usuário específico por ID (apenas para administradores ou o próprio usuário)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// Atualizar um usuário (apenas para administradores ou o próprio usuário)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, role } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se o email já está em uso por outro usuário
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Este email já está em uso' });
      }
    }
    
    // Atualizar os dados do usuário
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email,
      phone: phone || user.phone,
      // Apenas administradores podem mudar o papel do usuário
      role: req.user.role === 'admin' ? (role || user.role) : user.role
    });
    
    // Retornar os dados atualizados (sem a senha)
    return res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// Alterar a senha do usuário (apenas o próprio usuário)
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Verificar se as senhas novas coincidem
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se a senha atual está correta
    const isPasswordValid = user.checkPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }
    
    // Atualizar a senha
    await user.update({ password: newPassword });
    
    return res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return res.status(500).json({ message: 'Erro ao alterar senha' });
  }
};

// Desativar/ativar um usuário (apenas para administradores)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Alternar o status do usuário
    await user.update({ active: !user.active });
    
    return res.status(200).json({
      message: user.active ? 'Usuário ativado com sucesso' : 'Usuário desativado com sucesso',
      active: user.active
    });
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    return res.status(500).json({ message: 'Erro ao alterar status do usuário' });
  }
};

// Promover um usuário para administrador (apenas para administradores)
exports.promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Promover o usuário para administrador
    await user.update({ role: 'admin' });
    
    return res.status(200).json({
      message: 'Usuário promovido a administrador com sucesso',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    return res.status(500).json({ message: 'Erro ao promover usuário' });
  }
};

// Obter o perfil do usuário logado
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Formatar a resposta
    const userProfile = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt
    };
    
    return res.status(200).json(userProfile);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
  }
};
