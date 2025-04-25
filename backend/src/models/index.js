const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');

// Definindo as associações entre os modelos
Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
User.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });

Article.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Article, { foreignKey: 'category_id', as: 'articles' });

// Criando uma tabela de junção para artigos favoritos
User.belongsToMany(Article, { through: 'user_favorites', as: 'favoriteArticles' });
Article.belongsToMany(User, { through: 'user_favorites', as: 'favoritedBy' });

// Exportando os modelos e o sequelize
module.exports = {
  sequelize,
  User,
  Category,
  Article
};
