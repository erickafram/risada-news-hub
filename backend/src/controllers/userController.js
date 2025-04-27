const { User, Article } = require('../models');
const { UserReaction } = require('./reactionController');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Listar todos os usuários (apenas para administradores)
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Construir condições de busca
    const whereConditions = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (role && role !== 'all') {
      whereConditions.role = role;
    }
    
    if (status === 'active') {
      whereConditions.active = true;
    } else if (status === 'inactive') {
      whereConditions.active = false;
    }
    
    // Buscar usuários com paginação
    const { count, rows: users } = await User.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Para cada usuário, contar quantos artigos ele escreveu
    const usersWithArticleCount = await Promise.all(users.map(async (user) => {
      // Usando o nome correto do campo no banco de dados (author_id)
      const articlesCount = await Article.count({
        where: { author_id: user.id }
      });
      
      // Formatar a data do último login (se existir)
      let lastLogin = user.lastLogin || null;
      
      return {
        ...user.toJSON(),
        articlesCount,
        lastLogin
      };
    }));
    
    return res.status(200).json({
      users: usersWithArticleCount,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
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

// Criar um novo usuário (apenas para administradores)
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;
    
    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está em uso' });
    }
    
    // Criar o novo usuário
    const newUser = await User.create({
      fullName,
      email,
      phone: phone || '(00) 00000-0000', // Valor padrão se não for fornecido
      password,
      role: role || 'subscriber', // Valor padrão se não for fornecido
      active: true
    });
    
    // Retornar os dados do usuário criado (sem a senha)
    return res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      active: newUser.active,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

// Excluir um usuário (apenas para administradores)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Não permitir excluir o próprio usuário
    if (user.id === req.user.id) {
      return res.status(403).json({ message: 'Você não pode excluir sua própria conta' });
    }
    
    // Excluir o usuário
    await user.destroy();
    
    return res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
};

// Alterar o papel do usuário (admin ou reader)
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'reader'].includes(role)) {
      return res.status(400).json({ message: 'Papel inválido. Use "admin" ou "reader"' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Não permitir alterar o próprio papel (para evitar que um admin remova seus próprios privilégios)
    if (user.id === req.user.id) {
      return res.status(403).json({ message: 'Você não pode alterar seu próprio papel' });
    }
    
    // Alterar o papel do usuário
    await user.update({ role });
    
    return res.status(200).json({
      message: `Usuário alterado para ${role === 'admin' ? 'administrador' : 'leitor'} com sucesso`,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao alterar papel do usuário:', error);
    return res.status(500).json({ message: 'Erro ao alterar papel do usuário' });
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
