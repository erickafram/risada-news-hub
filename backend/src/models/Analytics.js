'use strict';

module.exports = (sequelize, DataTypes) => {
  const Analytics = sequelize.define('Analytics', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    page_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    unique_visitors: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    avg_time_on_site: {
      type: DataTypes.INTEGER,  // em segundos
      defaultValue: 0
    },
    bounce_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'analytics'
  });

  return Analytics;
};
