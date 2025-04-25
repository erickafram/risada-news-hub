const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para verificar se o usuário está autenticado
exports.authenticate = async (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Extrair o token do cabeçalho
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar o usuário pelo ID decodificado do token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({ message: 'Usuário desativado' });
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Passar para o próximo middleware
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    console.error('Erro de autenticação:', error);
    return res.status(500).json({ message: 'Erro de autenticação' });
  }
};

// Middleware para verificar se o usuário é administrador
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

// Middleware para verificar se o usuário é o proprietário do recurso ou um administrador
exports.isOwnerOrAdmin = (paramIdField) => {
  return (req, res, next) => {
    const resourceId = parseInt(req.params[paramIdField]);
    const userId = req.user.id;
    
    if (req.user.role === 'admin' || userId === resourceId) {
      next();
    } else {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para acessar este recurso.' });
    }
  };
};
