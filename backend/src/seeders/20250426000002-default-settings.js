'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const defaultSettings = [
      // Configurações gerais
      {
        key: 'site_title',
        value: 'Risada News Hub',
        group: 'general',
        description: 'Título do site',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'site_description',
        value: 'Portal de notícias e entretenimento',
        group: 'general',
        description: 'Descrição do site',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'site_url',
        value: 'https://risadanews.com.br',
        group: 'general',
        description: 'URL do site',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'admin_email',
        value: 'admin@risadanews.com.br',
        group: 'general',
        description: 'Email do administrador',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'language',
        value: 'pt-BR',
        group: 'general',
        description: 'Idioma padrão',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'timezone',
        value: 'America/Sao_Paulo',
        group: 'general',
        description: 'Fuso horário',
        created_at: new Date(),
        updated_at: new Date()
      },

      // Configurações de conteúdo
      {
        key: 'posts_per_page',
        value: '10',
        group: 'content',
        description: 'Número de posts por página',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'enable_comments',
        value: 'true',
        group: 'content',
        description: 'Habilitar comentários',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'moderate_comments',
        value: 'true',
        group: 'content',
        description: 'Moderar comentários',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'enable_rss',
        value: 'true',
        group: 'content',
        description: 'Habilitar RSS',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'enable_social_sharing',
        value: 'true',
        group: 'content',
        description: 'Habilitar compartilhamento social',
        created_at: new Date(),
        updated_at: new Date()
      },

      // Configurações de aparência
      {
        key: 'theme',
        value: 'light',
        group: 'appearance',
        description: 'Tema do site',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'primary_color',
        value: '#3b82f6',
        group: 'appearance',
        description: 'Cor primária',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'logo_url',
        value: '/logo.png',
        group: 'appearance',
        description: 'URL do logo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'favicon_url',
        value: '/favicon.ico',
        group: 'appearance',
        description: 'URL do favicon',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('settings', defaultSettings, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settings', null, {});
  }
};
