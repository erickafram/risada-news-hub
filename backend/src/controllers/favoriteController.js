const { User, Article } = require('../models');

// Adicionar um artigo aos favoritos
exports.addFavorite = async (req, res) => {
  try {
    const { articleId } = req.body;
    const userId = req.user.id;

    // Verificar se o artigo existe
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }

    // Verificar se já está nos favoritos
    const sequelize = require('../config/database');
    const [results] = await sequelize.query(
      'SELECT * FROM user_favorites WHERE user_id = ? AND article_id = ?',
      { replacements: [userId, articleId] }
    );

    if (results.length > 0) {
      return res.status(200).json({ message: 'Artigo já está nos favoritos' });
    }

    // Adicionar aos favoritos usando SQL direto
    await sequelize.query(
      'INSERT INTO user_favorites (user_id, article_id) VALUES (?, ?)',
      { replacements: [userId, articleId] }
    );

    return res.status(200).json({ message: 'Artigo adicionado aos favoritos' });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    return res.status(500).json({ message: 'Erro ao adicionar artigo aos favoritos' });
  }
};

// Remover um artigo dos favoritos
exports.removeFavorite = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;

    // Verificar se o artigo existe
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }

    // Remover dos favoritos usando SQL direto
    const sequelize = require('../config/database');
    await sequelize.query(
      'DELETE FROM user_favorites WHERE user_id = ? AND article_id = ?',
      { replacements: [userId, articleId] }
    );

    return res.status(200).json({ message: 'Artigo removido dos favoritos' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    return res.status(500).json({ message: 'Erro ao remover artigo dos favoritos' });
  }
};

// Listar artigos favoritos do usuário
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const sequelize = require('../config/database');

    // Buscar favoritos com informações dos artigos usando SQL direto
    const [favorites] = await sequelize.query(`
      SELECT a.id, a.title, a.slug, a.featured_image, a.published_at 
      FROM articles a
      JOIN user_favorites uf ON a.id = uf.article_id
      WHERE uf.user_id = ?
      ORDER BY a.published_at DESC
    `, { replacements: [userId] });

    return res.status(200).json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return res.status(500).json({ message: 'Erro ao buscar artigos favoritos' });
  }
};

// Verificar se um artigo está nos favoritos do usuário
exports.checkFavorite = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;
    
    const sequelize = require('../config/database');
    const [results] = await sequelize.query(
      'SELECT * FROM user_favorites WHERE user_id = ? AND article_id = ?',
      { replacements: [userId, articleId] }
    );
    
    const isFavorite = results.length > 0;
    
    return res.status(200).json({ isFavorite });
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return res.status(500).json({ message: 'Erro ao verificar se artigo está nos favoritos' });
  }
};
