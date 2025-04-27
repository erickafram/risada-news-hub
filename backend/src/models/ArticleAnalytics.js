'use strict';

module.exports = (sequelize, DataTypes) => {
  const ArticleAnalytics = sequelize.define('ArticleAnalytics', {
    article_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'articles',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    unique_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    avg_time_on_page: {
      type: DataTypes.INTEGER,  // em segundos
      defaultValue: 0
    }
  }, {
    tableName: 'article_analytics'
  });

  ArticleAnalytics.associate = (models) => {
    ArticleAnalytics.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article'
    });
  };

  return ArticleAnalytics;
};
