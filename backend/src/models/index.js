const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const Comment = require('./Comment');
const Setting = require('./Setting');
const Page = require('./Page');

// Definindo as associações entre os modelos
Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
User.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });

Article.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Article, { foreignKey: 'category_id', as: 'articles' });

// Criando uma tabela de junção para artigos favoritos
User.belongsToMany(Article, { through: 'user_favorites', as: 'favoriteArticles' });
Article.belongsToMany(User, { through: 'user_favorites', as: 'favoritedBy' });

// Associações para comentários
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });

Comment.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });
Article.hasMany(Comment, { foreignKey: 'article_id', as: 'comments' });

// Definindo associações para o modelo Page
Page.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Exportando os modelos e o sequelize
module.exports = {
  sequelize,
  User,
  Category,
  Article,
  Comment,
  Setting,
  Page
};
