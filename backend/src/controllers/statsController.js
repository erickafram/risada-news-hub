const { Category, Article, sequelize } = require('../models');

// Obter estatísticas para o dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    console.log('[BACKEND] Buscando estatísticas para o dashboard');
    
    // Contar categorias
    const categoryCount = await Category.count({
      where: { active: true }
    });
    
    // Contar artigos
    const articleCount = await Article.count({
      where: { published: true }
    });
    
    // Obter total de visualizações (soma do campo views de todos os artigos)
    const viewsResult = await Article.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('views')), 'totalViews']
      ],
      where: { published: true }
    });
    
    // Extrair o valor total de visualizações ou definir como 0 se for nulo
    const totalViews = viewsResult && viewsResult.getDataValue('totalViews') ? Number(viewsResult.getDataValue('totalViews')) : 0;
    
    // Obter artigos mais visualizados
    const topArticles = await Article.findAll({
      attributes: ['id', 'title', 'views', 'slug'],
      where: { published: true },
      order: [['views', 'DESC']],
      limit: 5
    });
    
    // Obter artigos mais recentes
    const recentArticles = await Article.findAll({
      attributes: ['id', 'title', 'createdAt', 'slug'],
      where: { published: true },
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Obter contagem de artigos por categoria
    const articlesByCategory = await Category.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('articles.id')), 'articleCount']
      ],
      include: [{
        model: Article,
        as: 'articles',  // Usando o alias correto definido no models/index.js
        attributes: [],
        where: { published: true }
      }],
      group: ['Category.id'],
      order: [[sequelize.literal('articleCount'), 'DESC']]
    });
    
    console.log('[BACKEND] Estatísticas obtidas com sucesso:', {
      categoryCount,
      articleCount,
      totalViews
    });
    
    return res.status(200).json({
      categoryCount,
      articleCount,
      totalViews,
      topArticles,
      recentArticles,
      articlesByCategory
    });
  } catch (error) {
    console.error('[BACKEND] Erro ao buscar estatísticas:', error);
    return res.status(500).json({ message: 'Erro ao buscar estatísticas do dashboard' });
  }
};
