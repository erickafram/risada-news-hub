const { Page, User } = require('../models');
const slugify = require('slugify');
const { Op } = require('sequelize');

// Obter todas as páginas (com paginação e filtros)
exports.getAllPages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || null;
    const search = req.query.search || '';
    
    // Construir condições de busca
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Buscar páginas com contagem total
    const { count, rows } = await Page.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['updated_at', 'DESC']],
      limit,
      offset,
      distinct: true
    });
    
    // Calcular informações de paginação
    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return res.status(200).json({
      pages: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    console.error('[BACKEND] Erro ao buscar páginas:', error);
    return res.status(500).json({ message: 'Erro ao buscar páginas' });
  }
};

// Obter uma página específica pelo ID
exports.getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const page = await Page.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'email']
        }
      ]
    });
    
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    return res.status(200).json(page);
  } catch (error) {
    console.error(`[BACKEND] Erro ao buscar página com ID ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro ao buscar página' });
  }
};

// Obter uma página pelo slug (para exibição pública)
exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const page = await Page.findOne({
      where: { 
        slug,
        status: 'published' // Apenas páginas publicadas
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    return res.status(200).json(page);
  } catch (error) {
    console.error(`[BACKEND] Erro ao buscar página com slug ${req.params.slug}:`, error);
    return res.status(500).json({ message: 'Erro ao buscar página' });
  }
};

// Obter páginas para o menu
exports.getMenuPages = async (req, res) => {
  try {
    const menuPages = await Page.findAll({
      where: { 
        status: 'published',
        showInMenu: true
      },
      attributes: ['id', 'title', 'slug', 'menuOrder'],
      order: [['menuOrder', 'ASC']]
    });
    
    return res.status(200).json(menuPages);
  } catch (error) {
    console.error('[BACKEND] Erro ao buscar páginas do menu:', error);
    return res.status(500).json({ message: 'Erro ao buscar páginas do menu' });
  }
};

// Criar uma nova página
exports.createPage = async (req, res) => {
  try {
    const { 
      title, content, metaTitle, metaDescription, 
      featuredImage, status, showInMenu, menuOrder, slug 
    } = req.body;
    
    // Validar campos obrigatórios
    if (!title || !content) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios' });
    }
    
    // Gerar slug a partir do título, se não fornecido
    const pageSlug = slug || slugify(title, { 
      lower: true,
      strict: true,
      locale: 'pt'
    });
    
    // Verificar se já existe uma página com este slug
    const existingPage = await Page.findOne({ where: { slug: pageSlug } });
    if (existingPage) {
      return res.status(400).json({ message: 'Já existe uma página com este slug' });
    }
    
    // Criar a página
    const newPage = await Page.create({
      title,
      slug: pageSlug,
      content,
      metaTitle: metaTitle || title,
      metaDescription,
      featuredImage,
      status: status || 'draft',
      showInMenu: showInMenu || false,
      menuOrder: menuOrder || 0,
      authorId: req.user.id
    });
    
    return res.status(201).json({
      message: 'Página criada com sucesso',
      page: newPage
    });
  } catch (error) {
    console.error('[BACKEND] Erro ao criar página:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: error.errors.map(e => e.message) 
      });
    }
    
    return res.status(500).json({ message: 'Erro ao criar página' });
  }
};

// Atualizar uma página existente
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, content, metaTitle, metaDescription, 
      featuredImage, status, showInMenu, menuOrder, slug 
    } = req.body;
    
    // Buscar a página
    const page = await Page.findByPk(id);
    
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    // Verificar se o slug foi alterado e se já existe
    if (slug && slug !== page.slug) {
      const existingPage = await Page.findOne({ 
        where: { 
          slug,
          id: { [Op.ne]: id } // Não incluir a própria página na verificação
        } 
      });
      
      if (existingPage) {
        return res.status(400).json({ message: 'Já existe uma página com este slug' });
      }
    }
    
    // Atualizar a página
    await page.update({
      title: title || page.title,
      slug: slug || page.slug,
      content: content || page.content,
      metaTitle: metaTitle || page.metaTitle,
      metaDescription: metaDescription !== undefined ? metaDescription : page.metaDescription,
      featuredImage: featuredImage !== undefined ? featuredImage : page.featuredImage,
      status: status || page.status,
      showInMenu: showInMenu !== undefined ? showInMenu : page.showInMenu,
      menuOrder: menuOrder !== undefined ? menuOrder : page.menuOrder
    });
    
    return res.status(200).json({
      message: 'Página atualizada com sucesso',
      page
    });
  } catch (error) {
    console.error(`[BACKEND] Erro ao atualizar página com ID ${req.params.id}:`, error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: error.errors.map(e => e.message) 
      });
    }
    
    return res.status(500).json({ message: 'Erro ao atualizar página' });
  }
};

// Excluir uma página
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const page = await Page.findByPk(id);
    
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    
    await page.destroy();
    
    return res.status(200).json({ message: 'Página excluída com sucesso' });
  } catch (error) {
    console.error(`[BACKEND] Erro ao excluir página com ID ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro ao excluir página' });
  }
};
