'use strict';

module.exports = (sequelize, DataTypes) => {
  const TrafficSource = sequelize.define('TrafficSource', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'traffic_sources'
  });

  return TrafficSource;
};
