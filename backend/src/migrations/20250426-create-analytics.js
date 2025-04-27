'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('analytics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      page_views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      unique_visitors: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      avg_time_on_site: {
        type: Sequelize.INTEGER,  // em segundos
        defaultValue: 0
      },
      bounce_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Tabela para armazenar estatísticas de artigos
    await queryInterface.createTable('article_analytics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      article_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'articles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      unique_views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      avg_time_on_page: {
        type: Sequelize.INTEGER,  // em segundos
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Tabela para armazenar estatísticas de fontes de tráfego
    await queryInterface.createTable('traffic_sources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false
      },
      visits: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Tabela para armazenar estatísticas de dispositivos
    await queryInterface.createTable('device_analytics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      device_type: {
        type: Sequelize.STRING,  // 'desktop', 'mobile', 'tablet'
        allowNull: false
      },
      visits: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('analytics');
    await queryInterface.dropTable('article_analytics');
    await queryInterface.dropTable('traffic_sources');
    await queryInterface.dropTable('device_analytics');
  }
};
