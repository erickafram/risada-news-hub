const { User, Article, sequelize } = require('../models');

// Definir modelo de comentários usando SQL direto para garantir que a tabela exista
const createCommentsTable = async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        parent_id INT DEFAULT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Tabela de comentários criada ou já existente');
  } catch (error) {
    console.error('Erro ao criar tabela de comentários:', error);
  }
};

// Executar a criação da tabela
createCommentsTable();

// Definir modelo comments com Sequelize após garantir que a tabela existe
const Comment = sequelize.define('comments', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  article_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  user_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  parent_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: true
  },
  content: {
    type: sequelize.Sequelize.TEXT,
    allowNull: false
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Função para verificar o token do reCAPTCHA
const verifyCaptcha = async (token) => {
  // Em um ambiente de produção, você deve verificar o token com a API do Google
  // Aqui estamos apenas simulando a verificação para fins de demonstração
  
  // Para implementação real, use algo como:
  // const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   body: `secret=YOUR_SECRET_KEY&response=${token}`
  // });
  // const data = await response.json();
  // return data.success;
  
  // Simulação para desenvolvimento
  console.log('[BACKEND] Verificando token CAPTCHA:', token);
  return !!token; // Retorna true se o token existir
};

// Adicionar comentário
exports.addComment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { articleId } = req.params;
    const { content, parentId, captchaToken } = req.body;
    const userId = req.user.id;
    
    console.log('[BACKEND] Recebido pedido para adicionar comentário:', {
      articleId,
      userId,
      content: content.substring(0, 30) + '...',
      captchaToken: captchaToken ? 'Presente' : 'Ausente'
    });
    
    // Verificar o token do CAPTCHA
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      console.log('[BACKEND] Verificação de CAPTCHA falhou');
      await transaction.rollback();
      return res.status(400).json({ message: 'Verificação de CAPTCHA falhou. Por favor, tente novamente.' });
    }
    
    // Verificar se o artigo existe
    const article = await Article.findByPk(articleId);
    if (!article) {
      console.log('[BACKEND] Artigo não encontrado:', articleId);
      await transaction.rollback();
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    
    // Verificar se o comentário pai existe, se fornecido
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        console.log('[BACKEND] Comentário pai não encontrado:', parentId);
        await transaction.rollback();
        return res.status(404).json({ message: 'Comentário pai não encontrado' });
      }
    }
    
    // Criar o comentário
    const comment = await Comment.create({
      article_id: articleId,
      user_id: userId,
      parent_id: parentId || null,
      content
    }, { transaction });
    
    console.log('[BACKEND] Comentário criado com sucesso:', comment.id);
    
    // Buscar informações do usuário para retornar junto com o comentário
    const user = await User.findByPk(userId, {
      attributes: ['id', 'full_name'],
      transaction
    });
    
    await transaction.commit();
    
    return res.status(201).json({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      user: {
        id: user.id,
        fullName: user.full_name
      },
      parent_id: comment.parent_id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao adicionar comentário:', error);
    return res.status(500).json({ message: 'Erro ao adicionar comentário' });
  }
};

// Obter comentários de um artigo
exports.getArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params;
    console.log('[BACKEND] Buscando comentários para o artigo:', articleId);
    
    // Verificar se o artigo existe
    const article = await Article.findByPk(articleId);
    if (!article) {
      console.log('[BACKEND] Artigo não encontrado:', articleId);
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    
    // Buscar todos os comentários do artigo
    const comments = await Comment.findAll({
      where: { article_id: articleId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    console.log('[BACKEND] Comentários encontrados:', comments.length);
    
    // Formatar os comentários para a resposta
    const formattedComments = comments.map(comment => {
      // Verificar se o usuário existe
      const user = comment.user ? {
        id: comment.user.id,
        fullName: comment.user.full_name
      } : {
        id: 0,
        fullName: 'Usuário Anônimo'
      };
      
      return {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: user,
        parent_id: comment.parent_id
      };
    });
    
    console.log('[BACKEND] Comentários formatados:', formattedComments);
    return res.status(200).json(formattedComments);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return res.status(500).json({ message: 'Erro ao buscar comentários' });
  }
};

// Excluir comentário
exports.deleteComment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    
    // Buscar o comentário
    const comment = await Comment.findByPk(commentId, { transaction });
    
    if (!comment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }
    
    // Verificar se o usuário é o autor do comentário ou um administrador
    if (comment.user_id !== userId && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({ message: 'Não autorizado a excluir este comentário' });
    }
    
    // Excluir o comentário
    await comment.destroy({ transaction });
    
    await transaction.commit();
    
    return res.status(200).json({ message: 'Comentário excluído com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao excluir comentário:', error);
    return res.status(500).json({ message: 'Erro ao excluir comentário' });
  }
};

// Obter contagem de comentários para um artigo
exports.getCommentCount = async (req, res) => {
  try {
    const { articleId } = req.params;
    
    // Contar comentários para o artigo
    const count = await Comment.count({
      where: { article_id: articleId }
    });
    
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Erro ao contar comentários:', error);
    return res.status(500).json({ message: 'Erro ao contar comentários' });
  }
};

// Configurar associações
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });

module.exports.Comment = Comment;
