const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O título da página é obrigatório'
      }
    }
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este slug já está em uso'
    },
    validate: {
      notEmpty: {
        msg: 'O slug da página é obrigatório'
      }
    }
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O conteúdo da página é obrigatório'
      }
    }
  },
  metaTitle: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'meta_title'
  },
  metaDescription: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'meta_description'
  },
  featuredImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'featured_image'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
    allowNull: false
  },
  showInMenu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'show_in_menu'
  },
  menuOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    field: 'menu_order'
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'author_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'pages',
  timestamps: true,
  underscored: true
});

module.exports = Page;
