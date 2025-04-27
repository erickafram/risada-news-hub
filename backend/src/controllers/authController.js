const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Controller para registro de usuários
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }

    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está em uso' });
    }

    // Criar o novo usuário (por padrão como leitor)
    const newUser = await User.create({
      fullName,
      email,
      phone,
      password,
      role: 'subscriber' // Por padrão, todos os novos usuários são leitores
    });

    // Gerar token JWT
    const token = generateToken(newUser);

    // Retornar os dados do usuário (sem a senha) e o token
    return res.status(201).json({
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Controller para login de usuários
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar o usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({ message: 'Sua conta está desativada' });
    }

    // Atualizar a data do último login
    await user.update({ lastLogin: new Date() });

    // Gerar token JWT
    const token = generateToken(user);

    // Retornar os dados do usuário (sem a senha) e o token
    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        lastLogin: user.lastLogin
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Controller para obter o perfil do usuário logado
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    return res.status(500).json({ message: 'Erro ao obter perfil' });
  }
};
