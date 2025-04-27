'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Primeiro, alterar a coluna para aceitar qualquer string temporariamente
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Atualizar os valores existentes (converter 'reader' para 'subscriber')
    await queryInterface.sequelize.query(`
      UPDATE users SET role = 'subscriber' WHERE role = 'reader'
    `);

    // Finalmente, alterar a coluna para usar o novo ENUM
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'editor', 'author', 'subscriber'),
      allowNull: false,
      defaultValue: 'subscriber'
    });
  },

  async down(queryInterface, Sequelize) {
    // Primeiro, alterar a coluna para aceitar qualquer string temporariamente
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Atualizar os valores existentes (converter 'subscriber' para 'reader')
    await queryInterface.sequelize.query(`
      UPDATE users SET role = 'reader' WHERE role = 'subscriber'
    `);

    // Finalmente, alterar a coluna para usar o ENUM original
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('reader', 'admin'),
      allowNull: false,
      defaultValue: 'reader'
    });
  }
};
