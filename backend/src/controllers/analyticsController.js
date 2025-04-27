const { 
  Analytics, 
  ArticleAnalytics, 
  TrafficSource, 
  DeviceAnalytics, 
  Article, 
  sequelize 
} = require('../models');
const { Op } = require('sequelize');

// Função auxiliar para gerar datas
const getDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    startDate,
    endDate
  };
};

// Função para gerar dados de exemplo para preencher o banco
const generateSampleData = async () => {
  const today = new Date();
  const articles = await Article.findAll({ where: { published: true } });
  
  // Fontes de tráfego para dados de exemplo
  const sources = [
    'Pesquisa orgânica', 
    'Redes sociais', 
    'Tráfego direto', 
    'Links externos', 
    'Email'
  ];
  
  // Dispositivos para dados de exemplo
  const devices = ['desktop', 'mobile', 'tablet'];
  
  // Gerar dados para os últimos 90 dias
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Gerar números aleatórios para as métricas
    const pageViews = Math.floor(Math.random() * 500) + 100;
    const uniqueVisitors = Math.floor(pageViews * (0.6 + Math.random() * 0.3));
    const avgTimeOnSite = Math.floor(Math.random() * 300) + 60; // 1-6 minutos em segundos
    const bounceRate = Math.random() * 60 + 20; // 20-80%
    
    // Criar ou atualizar registro de analytics para o dia
    await Analytics.findOrCreate({
      where: { date: dateString },
      defaults: {
        page_views: pageViews,
        unique_visitors: uniqueVisitors,
        avg_time_on_site: avgTimeOnSite,
        bounce_rate: bounceRate
      }
    });
    
    // Gerar dados para cada artigo
    for (const article of articles) {
      // Apenas alguns artigos recebem visualizações por dia (mais realista)
      if (Math.random() > 0.3) {
        const views = Math.floor(Math.random() * 100) + 1;
        const uniqueViews = Math.floor(views * (0.7 + Math.random() * 0.3));
        const avgTimeOnPage = Math.floor(Math.random() * 180) + 30; // 30s-3.5min
        
        await ArticleAnalytics.findOrCreate({
          where: { 
            article_id: article.id,
            date: dateString 
          },
          defaults: {
            views,
            unique_views: uniqueViews,
            avg_time_on_page: avgTimeOnPage
          }
        });
      }
    }
    
    // Gerar dados para fontes de tráfego
    let totalTraffic = pageViews;
    let remainingTraffic = totalTraffic;
    
    for (let j = 0; j < sources.length; j++) {
      const source = sources[j];
      let visits;
      
      if (j === sources.length - 1) {
        // Último item recebe o restante
        visits = remainingTraffic;
      } else {
        // Distribuir aleatoriamente
        const percentage = Math.random();
        visits = Math.floor(remainingTraffic * percentage);
        remainingTraffic -= visits;
      }
      
      await TrafficSource.findOrCreate({
        where: { 
          source,
          date: dateString 
        },
        defaults: {
          visits
        }
      });
    }
    
    // Gerar dados para dispositivos
    totalTraffic = pageViews;
    remainingTraffic = totalTraffic;
    
    for (let j = 0; j < devices.length; j++) {
      const deviceType = devices[j];
      let visits;
      
      if (j === devices.length - 1) {
        // Último item recebe o restante
        visits = remainingTraffic;
      } else {
        // Distribuir aleatoriamente, com mais peso para mobile e desktop
        let percentage;
        if (deviceType === 'desktop') {
          percentage = 0.3 + Math.random() * 0.2; // 30-50%
        } else if (deviceType === 'mobile') {
          percentage = 0.4 + Math.random() * 0.2; // 40-60%
        } else {
          percentage = Math.random() * 0.2; // 0-20%
        }
        
        visits = Math.floor(remainingTraffic * percentage);
        remainingTraffic -= visits;
      }
      
      await DeviceAnalytics.findOrCreate({
        where: { 
          device_type: deviceType,
          date: dateString 
        },
        defaults: {
          visits
        }
      });
    }
  }
  
  return true;
};

// Obter estatísticas gerais
exports.getOverviewStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let days = 30;
    
    // Converter período para dias
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    
    const { startDate, endDate } = getDateRange(days);
    
    // Verificar se existem dados
    const dataExists = await Analytics.count();
    
    // Se não existirem dados, gerar dados de exemplo
    if (dataExists === 0) {
      console.log('[ANALYTICS] Gerando dados de exemplo para analytics...');
      await generateSampleData();
      console.log('[ANALYTICS] Dados de exemplo gerados com sucesso!');
    }
    
    // Buscar dados de analytics para o período
    const analyticsData = await Analytics.findAll({
      where: {
        date: {
          [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
        }
      },
      order: [['date', 'ASC']]
    });
    
    // Calcular totais para o período atual
    const totalPageViews = analyticsData.reduce((sum, item) => sum + item.page_views, 0);
    const totalUniqueVisitors = analyticsData.reduce((sum, item) => sum + item.unique_visitors, 0);
    const avgTimeOnSite = analyticsData.length > 0 
      ? analyticsData.reduce((sum, item) => sum + item.avg_time_on_site, 0) / analyticsData.length
      : 0;
    const avgBounceRate = analyticsData.length > 0
      ? analyticsData.reduce((sum, item) => sum + item.bounce_rate, 0) / analyticsData.length
      : 0;
    
    // Buscar dados do período anterior para comparação
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);
    
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    
    const previousAnalyticsData = await Analytics.findAll({
      where: {
        date: {
          [Op.between]: [previousStartDate.toISOString().split('T')[0], previousEndDate.toISOString().split('T')[0]]
        }
      }
    });
    
    // Calcular totais para o período anterior
    const previousTotalPageViews = previousAnalyticsData.reduce((sum, item) => sum + item.page_views, 0);
    const previousTotalUniqueVisitors = previousAnalyticsData.reduce((sum, item) => sum + item.unique_visitors, 0);
    const previousAvgTimeOnSite = previousAnalyticsData.length > 0
      ? previousAnalyticsData.reduce((sum, item) => sum + item.avg_time_on_site, 0) / previousAnalyticsData.length
      : 0;
    const previousAvgBounceRate = previousAnalyticsData.length > 0
      ? previousAnalyticsData.reduce((sum, item) => sum + item.bounce_rate, 0) / previousAnalyticsData.length
      : 0;
    
    // Calcular variações percentuais
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return 0;
      return parseFloat(((current - previous) / previous * 100).toFixed(1));
    };
    
    const visitsGrowth = calculateGrowth(totalPageViews, previousTotalPageViews);
    const visitorGrowth = calculateGrowth(totalUniqueVisitors, previousTotalUniqueVisitors);
    const timeGrowth = calculateGrowth(avgTimeOnSite, previousAvgTimeOnSite);
    const bounceRateChange = calculateGrowth(avgBounceRate, previousAvgBounceRate);
    
    // Formatar tempo médio no site
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    };
    
    // Retornar dados formatados
    return res.status(200).json({
      overviewData: {
        totalVisits: totalPageViews,
        growth: visitsGrowth,
        uniqueVisitors: totalUniqueVisitors,
        visitorGrowth: visitorGrowth,
        avgTimeOnSite: formatTime(avgTimeOnSite),
        timeGrowth: timeGrowth,
        bounceRate: parseFloat(avgBounceRate.toFixed(1)),
        bounceRateChange: bounceRateChange
      },
      chartData: analyticsData.map(item => ({
        date: item.date,
        pageViews: item.page_views,
        uniqueVisitors: item.unique_visitors
      }))
    });
  } catch (error) {
    console.error('[ANALYTICS] Erro ao buscar estatísticas gerais:', error);
    return res.status(500).json({ message: 'Erro ao buscar estatísticas gerais' });
  }
};

// Obter estatísticas de conteúdo
exports.getContentStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let days = 30;
    
    // Converter período para dias
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    
    const { startDate, endDate } = getDateRange(days);
    
    // Buscar artigos mais populares no período
    const popularArticles = await ArticleAnalytics.findAll({
      attributes: [
        'article_id',
        [sequelize.fn('SUM', sequelize.col('views')), 'totalViews'],
        [sequelize.fn('AVG', sequelize.col('avg_time_on_page')), 'avgTimeOnPage']
      ],
      where: {
        date: {
          [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
        }
      },
      include: [{
        model: Article,
        as: 'article',
        attributes: ['id', 'title', 'slug']
      }],
      group: ['article_id', 'article.id'],
      order: [[sequelize.literal('totalViews'), 'DESC']],
      limit: 10
    });
    
    // Buscar dados do período anterior para comparação
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);
    
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    
    // Obter visualizações anteriores para cada artigo
    const articleIds = popularArticles.map(item => item.article_id);
    
    const previousArticleViews = await ArticleAnalytics.findAll({
      attributes: [
        'article_id',
        [sequelize.fn('SUM', sequelize.col('views')), 'totalViews']
      ],
      where: {
        article_id: { [Op.in]: articleIds },
        date: {
          [Op.between]: [previousStartDate.toISOString().split('T')[0], previousEndDate.toISOString().split('T')[0]]
        }
      },
      group: ['article_id']
    });
    
    // Criar mapa de visualizações anteriores por ID do artigo
    const previousViewsMap = {};
    previousArticleViews.forEach(item => {
      previousViewsMap[item.article_id] = parseInt(item.getDataValue('totalViews'));
    });
    
    // Calcular variação percentual
    const formattedArticles = popularArticles.map(item => {
      const currentViews = parseInt(item.getDataValue('totalViews'));
      const previousViews = previousViewsMap[item.article_id] || 0;
      
      let change = 0;
      if (previousViews > 0) {
        change = parseFloat(((currentViews - previousViews) / previousViews * 100).toFixed(1));
      }
      
      return {
        id: item.article_id,
        title: item.article.title,
        views: currentViews,
        change: change,
        slug: item.article.slug
      };
    });
    
    return res.status(200).json({
      popularArticles: formattedArticles
    });
  } catch (error) {
    console.error('[ANALYTICS] Erro ao buscar estatísticas de conteúdo:', error);
    return res.status(500).json({ message: 'Erro ao buscar estatísticas de conteúdo' });
  }
};

// Obter estatísticas de audiência
exports.getAudienceStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let days = 30;
    
    // Converter período para dias
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    
    const { startDate, endDate } = getDateRange(days);
    
    // Buscar dados de dispositivos
    const deviceData = await DeviceAnalytics.findAll({
      attributes: [
        'device_type',
        [sequelize.fn('SUM', sequelize.col('visits')), 'totalVisits']
      ],
      where: {
        date: {
          [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
        }
      },
      group: ['device_type'],
      order: [[sequelize.literal('totalVisits'), 'DESC']]
    });
    
    // Calcular total de visitas
    const totalVisits = deviceData.reduce((sum, item) => sum + parseInt(item.getDataValue('totalVisits')), 0);
    
    // Calcular percentuais
    const devices = deviceData.map(item => {
      const visits = parseInt(item.getDataValue('totalVisits'));
      const percentage = totalVisits > 0 ? parseFloat((visits / totalVisits * 100).toFixed(1)) : 0;
      
      return {
        device: item.device_type,
        visits,
        percentage
      };
    });
    
    return res.status(200).json({
      devices
    });
  } catch (error) {
    console.error('[ANALYTICS] Erro ao buscar estatísticas de audiência:', error);
    return res.status(500).json({ message: 'Erro ao buscar estatísticas de audiência' });
  }
};

// Obter estatísticas de fontes de tráfego
exports.getTrafficSourceStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    let days = 30;
    
    // Converter período para dias
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    
    const { startDate, endDate } = getDateRange(days);
    
    // Buscar dados de fontes de tráfego
    const sourceData = await TrafficSource.findAll({
      attributes: [
        'source',
        [sequelize.fn('SUM', sequelize.col('visits')), 'totalVisits']
      ],
      where: {
        date: {
          [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
        }
      },
      group: ['source'],
      order: [[sequelize.literal('totalVisits'), 'DESC']]
    });
    
    // Buscar dados do período anterior para comparação
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);
    
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    
    const previousSourceData = await TrafficSource.findAll({
      attributes: [
        'source',
        [sequelize.fn('SUM', sequelize.col('visits')), 'totalVisits']
      ],
      where: {
        date: {
          [Op.between]: [previousStartDate.toISOString().split('T')[0], previousEndDate.toISOString().split('T')[0]]
        }
      },
      group: ['source']
    });
    
    // Criar mapa de visitas anteriores por fonte
    const previousVisitsMap = {};
    previousSourceData.forEach(item => {
      previousVisitsMap[item.source] = parseInt(item.getDataValue('totalVisits'));
    });
    
    // Calcular total de visitas
    const totalVisits = sourceData.reduce((sum, item) => sum + parseInt(item.getDataValue('totalVisits')), 0);
    
    // Calcular percentuais e variações
    const sources = sourceData.map(item => {
      const visits = parseInt(item.getDataValue('totalVisits'));
      const percentage = totalVisits > 0 ? parseFloat((visits / totalVisits * 100).toFixed(1)) : 0;
      const previousVisits = previousVisitsMap[item.source] || 0;
      
      let change = 0;
      if (previousVisits > 0) {
        change = parseFloat(((visits - previousVisits) / previousVisits * 100).toFixed(1));
      }
      
      return {
        source: item.source,
        percentage,
        change
      };
    });
    
    return res.status(200).json({
      trafficSources: sources
    });
  } catch (error) {
    console.error('[ANALYTICS] Erro ao buscar estatísticas de fontes de tráfego:', error);
    return res.status(500).json({ message: 'Erro ao buscar estatísticas de fontes de tráfego' });
  }
};
