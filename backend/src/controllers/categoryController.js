const { Category } = require('../models');

// Função para criar slug a partir do nome da categoria
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

// Listar todas as categorias (público)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { active: true },
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ message: 'Erro ao listar categorias' });
  }
};

// Listar todas as categorias (incluindo inativas, apenas para administradores)
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ message: 'Erro ao listar categorias' });
  }
};

// Obter uma categoria específica por ID ou slug
exports.getCategoryByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let category;
    
    // Verificar se o identificador é um número (ID) ou string (slug)
    if (!isNaN(identifier)) {
      category = await Category.findByPk(identifier);
    } else {
      category = await Category.findOne({ where: { slug: identifier } });
    }
    
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    // Se o usuário não for admin e a categoria estiver inativa, retornar erro
    if (!category.active && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    return res.status(200).json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return res.status(500).json({ message: 'Erro ao buscar categoria' });
  }
};

// Criar uma nova categoria (apenas para administradores)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'O nome da categoria é obrigatório' });
    }
    
    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Já existe uma categoria com este nome' });
    }
    
    // Criar slug a partir do nome
    const slug = createSlug(name);
    
    // Verificar se já existe uma categoria com o mesmo slug
    const existingSlug = await Category.findOne({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({ message: 'Já existe uma categoria com este slug' });
    }
    
    // Criar a nova categoria
    const newCategory = await Category.create({
      name,
      slug,
      description: description || null
    });
    
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ message: 'Erro ao criar categoria' });
  }
};

// Atualizar uma categoria (apenas para administradores)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, active } = req.body;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    // Se o nome for alterado, verificar se já existe outra categoria com o mesmo nome
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Já existe uma categoria com este nome' });
      }
      
      // Criar novo slug a partir do novo nome
      const slug = createSlug(name);
      
      // Verificar se já existe outra categoria com o mesmo slug
      const existingSlug = await Category.findOne({ where: { slug } });
      if (existingSlug && existingSlug.id !== parseInt(id)) {
        return res.status(400).json({ message: 'Já existe uma categoria com este slug' });
      }
      
      // Atualizar o slug junto com o nome
      category.slug = slug;
    }
    
    // Atualizar os dados da categoria
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      active: active !== undefined ? active : category.active
    });
    
    return res.status(200).json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ message: 'Erro ao atualizar categoria' });
  }
};

// Excluir uma categoria (apenas para administradores)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    // Verificar se há artigos associados a esta categoria
    const articleCount = await category.countArticles();
    
    if (articleCount > 0) {
      // Se houver artigos, apenas desativar a categoria
      await category.update({ active: false });
      return res.status(200).json({ 
        message: 'Categoria desativada pois possui artigos associados',
        deactivated: true
      });
    }
    
    // Se não houver artigos, excluir a categoria
    await category.destroy();
    
    return res.status(200).json({ 
      message: 'Categoria excluída com sucesso',
      deleted: true
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return res.status(500).json({ message: 'Erro ao excluir categoria' });
  }
};
