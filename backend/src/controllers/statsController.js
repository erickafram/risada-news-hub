const { Category, Article, sequelize, User, Comment } = require('../models');
const { Op } = require('sequelize');

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
    
    // Calcular estatísticas de crescimento
    
    // Categorias criadas este mês
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const categoriesThisMonth = await Category.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });
    
    // Artigos criados esta semana
    const firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);
    
    const articlesThisWeek = await Article.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfWeek
        },
        published: true
      }
    });
    
    // Calcular crescimento percentual de visualizações
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    const viewsLastMonth = await Article.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('views')), 'totalViews']
      ],
      where: {
        updatedAt: {
          [Op.lt]: firstDayOfMonth,
          [Op.gte]: previousMonth
        },
        published: true
      }
    });
    
    const lastMonthViews = viewsLastMonth && viewsLastMonth.getDataValue('totalViews') ? Number(viewsLastMonth.getDataValue('totalViews')) : 0;
    
    // Calcular percentual de crescimento (evitar divisão por zero)
    let viewsGrowthPercent = 0;
    if (lastMonthViews > 0) {
      viewsGrowthPercent = Math.round((totalViews - lastMonthViews) / lastMonthViews * 100);
    }
    
    // Obter estatísticas de comentários
    let commentStats = {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0
    };

    try {
      // Verificar se a coluna status existe na tabela comments
      const commentAttributes = await sequelize.query(
        "SHOW COLUMNS FROM comments LIKE 'status'",
        { type: sequelize.QueryTypes.SELECT }
      );
      
      const statusColumnExists = commentAttributes.length > 0;
      
      // Contar total de comentários
      const totalComments = await Comment.count();
      commentStats.total = totalComments;
      
      // Se a coluna status existir, contar por status
      if (statusColumnExists) {
        const approvedComments = await Comment.count({ where: { status: 'approved' } });
        const pendingComments = await Comment.count({ where: { status: 'pending' } });
        const rejectedComments = await Comment.count({ where: { status: 'rejected' } });
        
        commentStats.approved = approvedComments;
        commentStats.pending = pendingComments;
        commentStats.rejected = rejectedComments;
      }
    } catch (error) {
      console.error('[BACKEND] Erro ao obter estatísticas de comentários:', error);
      // Continue com a execução, apenas com valores zerados para comentários
    }
    
    // Calcular percentuais de comentários
    const commentPercentages = {
      approved: commentStats.total > 0 ? Math.round((commentStats.approved / commentStats.total) * 100) : 0,
      pending: commentStats.total > 0 ? Math.round((commentStats.pending / commentStats.total) * 100) : 0,
      rejected: commentStats.total > 0 ? Math.round((commentStats.rejected / commentStats.total) * 100) : 0
    };
    
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
      totalViews,
      categoriesThisMonth,
      articlesThisWeek,
      viewsGrowthPercent
    });
    
    return res.status(200).json({
      categoryCount,
      articleCount,
      totalViews,
      topArticles,
      recentArticles,
      articlesByCategory,
      categoriesThisMonth,
      articlesThisWeek,
      viewsGrowthPercent,
      commentStats,
      commentPercentages
    });
  } catch (error) {
    console.error('[BACKEND] Erro ao buscar estatísticas:', error);
    return res.status(500).json({ message: 'Erro ao buscar estatísticas do dashboard' });
  }
};
