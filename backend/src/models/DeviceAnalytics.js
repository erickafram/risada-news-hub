'use strict';

module.exports = (sequelize, DataTypes) => {
  const DeviceAnalytics = sequelize.define('DeviceAnalytics', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    device_type: {
      type: DataTypes.STRING,  // 'desktop', 'mobile', 'tablet'
      allowNull: false
    },
    visits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'device_analytics'
  });

  return DeviceAnalytics;
};
