const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para verificar se o usuário está autenticado
exports.authenticate = async (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho Authorization
    const authHeader = req.headers.authorization;
    console.log('[AUTH] Cabeçalho de autorização:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Extrair o token do cabeçalho (formato: Bearer <token>)
    const token = authHeader.split(' ')[1];
    console.log('[AUTH] Token extraído:', token ? 'Presente' : 'Ausente');
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Verificar e decodificar o token
    const jwtSecret = process.env.JWT_SECRET || 'sua_chave_secreta';
    console.log('[AUTH] Tentando verificar token');
    
    const decoded = jwt.verify(token, jwtSecret);
    console.log('[AUTH] Token decodificado:', decoded ? `UserId: ${decoded.id}` : 'Falha');

    // Buscar o usuário pelo ID
    const user = await User.findByPk(decoded.id);
    console.log('[AUTH] Usuário encontrado:', user ? `ID: ${user.id}, Role: ${user.role}` : 'Não encontrado');
    
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = user;
    console.log('[AUTH] Autenticação bem-sucedida para usuário:', user.id);

    // Prosseguir para a próxima middleware ou rota
    next();
  } catch (error) {
    console.error('[AUTH] Erro de autenticação:', error.name, error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido', error: error.message });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado', error: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
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
