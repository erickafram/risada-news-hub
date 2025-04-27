'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Inserir usuários demo
    await queryInterface.bulkInsert('users', [
      {
        full_name: 'Administrador',
        email: 'admin@memepmw.com',
        phone: '(00) 00000-0000',
        password: await bcrypt.hash('password', 10),
        role: 'admin',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        full_name: 'Leitor Demo',
        email: 'leitor@memepmw.com',
        phone: '(00) 00000-0001',
        password: await bcrypt.hash('password', 10),
        role: 'subscriber',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Inserir categorias iniciais
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Entretenimento',
        slug: 'entretenimento',
        description: 'Notícias sobre entretenimento em geral',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Jogos',
        slug: 'jogos',
        description: 'Notícias sobre jogos e videogames',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Filmes',
        slug: 'filmes',
        description: 'Notícias sobre filmes e cinema',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Música',
        slug: 'musica',
        description: 'Notícias sobre música e shows',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Celebridades',
        slug: 'celebridades',
        description: 'Notícias sobre celebridades e famosos',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Estilo de Vida',
        slug: 'estilo-de-vida',
        description: 'Notícias sobre estilo de vida e bem-estar',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
