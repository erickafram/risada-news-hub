const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para verificar o token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret');
    
    // Buscar o usuário no banco de dados
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    
    // Adicionar o usuário ao objeto de requisição
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar se o usuário é administrador
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso' });
  }
  
  next();
};
