'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('comments', 'status', {
      type: Sequelize.ENUM('approved', 'pending', 'spam'),
      allowNull: false,
      defaultValue: 'pending',
      after: 'content'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('comments', 'status');
  }
};
