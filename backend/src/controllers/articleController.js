const { Article, Category, User } = require('../models');
const { Op } = require('sequelize');

// Função para criar slug a partir do título do artigo
const createSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .concat('-', Date.now().toString().slice(-6)); // Adiciona timestamp para garantir unicidade
};

// Listar todos os artigos publicados (público)
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    const offset = (page - 1) * limit;
    const where = { published: true };
    
    // Filtrar por categoria se fornecida
    if (category) {
      const categoryObj = await Category.findOne({
        where: { 
          [Op.or]: [
            { id: !isNaN(category) ? category : 0 },
            { slug: category }
          ],
          active: true
        }
      });
      
      if (categoryObj) {
        where.category_id = categoryObj.id;
      }
    }
    
    // Adicionar busca por termo se fornecido
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { summary: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Buscar artigos com paginação
    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
          where: { active: true }
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({
      articles,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Erro ao listar artigos:', error);
    return res.status(500).json({ message: 'Erro ao listar artigos' });
  }
};

// Listar todos os artigos (incluindo não publicados, apenas para administradores)
exports.getAllArticlesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    
    const offset = (page - 1) * limit;
    const where = {};
    
    // Filtrar por status de publicação
    if (status === 'published') {
      where.published = true;
    } else if (status === 'draft') {
      where.published = false;
    }
    
    // Filtrar por categoria se fornecida
    if (category) {
      where.category_id = category;
    }
    
    // Adicionar busca por termo se fornecido
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { summary: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Buscar artigos com paginação
    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({
      articles,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Erro ao listar artigos:', error);
    return res.status(500).json({ message: 'Erro ao listar artigos' });
  }
};

// Obter um artigo específico por ID ou slug
exports.getArticleByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let article;
    
    // Verificar se o identificador é um número (ID) ou string (slug)
    if (!isNaN(identifier)) {
      article = await Article.findByPk(identifier, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: User,
            as: 'author',
            attributes: ['id', 'fullName']
          }
        ]
      });
    } else {
      article = await Article.findOne({
        where: { slug: identifier },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: User,
            as: 'author',
            attributes: ['id', 'fullName']
          }
        ]
      });
    }
    
    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    
    // Se o usuário não for admin e o artigo não estiver publicado, retornar erro
    if (!article.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    
    // Incrementar contador de visualizações
    if (article.published) {
      await article.update({ views: article.views + 1 });
    }
    
    return res.status(200).json(article);
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return res.status(500).json({ message: 'Erro ao buscar artigo' });
  }
};

// Criar um novo artigo (apenas para administradores)
exports.createArticle = async (req, res) => {
  try {
    const { title, content, summary, categoryId, featuredImage, published } = req.body;
    
    if (!title || !content || !categoryId) {
      return res.status(400).json({ message: 'Título, conteúdo e categoria são obrigatórios' });
    }
    
    // Verificar se a categoria existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Categoria não encontrada' });
    }
    
    // Criar slug a partir do título
    const slug = createSlug(title);
    
    // Definir data de publicação se o artigo for publicado
    const publishedAt = published ? new Date() : null;
    
    // Criar o novo artigo
    const newArticle = await Article.create({
      title,
      slug,
      content,
      summary: summary || null,
      featuredImage: featuredImage || null,
      published: published || false,
      publishedAt,
      category_id: categoryId,
      author_id: req.user.id
    });
    
    // Buscar o artigo com as relações
    const article = await Article.findByPk(newArticle.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    return res.status(201).json(article);
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    return res.status(500).json({ message: 'Erro ao criar artigo' });
  }
};

// Atualizar um artigo (apenas para administradores)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, categoryId, featuredImage, published } = req.body;
    
    const article = await Article.findByPk(id);
    
    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    
    // Verificar se a categoria existe, se fornecida
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Categoria não encontrada' });
      }
    }
    
    // Se o título for alterado, criar novo slug
    let slug = article.slug;
    if (title && title !== article.title) {
      slug = createSlug(title);
    }
    
    // Verificar se o artigo está sendo publicado agora
    let publishedAt = article.publishedAt;
    if (published && !article.published) {
      publishedAt = new Date();
    }
    
    // Atualizar os dados do artigo
    await article.update({
      title: title || article.title,
      slug,
      content: content || article.content,
      summary: summary !== undefined ? summary : article.summary,
      featuredImage: featuredImage !== undefined ? featuredImage : article.featuredImage,
      published: published !== undefined ? published : article.published,
      publishedAt,
      category_id: categoryId || article.category_id
    });
    
    // Buscar o artigo atualizado com as relações
    const updatedArticle = await Article.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    return res.status(500).json({ message: 'Erro ao atualizar artigo' });
  }
};

// Excluir um artigo (apenas para administradores)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findByPk(id);
    
    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    
    // Excluir o artigo
    await article.destroy();
    
    return res.status(200).json({ message: 'Artigo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir artigo:', error);
    return res.status(500).json({ message: 'Erro ao excluir artigo' });
  }
};
