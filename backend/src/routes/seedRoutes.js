const express = require('express');
const router = express.Router();
const { sequelize, User, Article, Category } = require('../models');

// Rota para adicionar artigos de exemplo
router.post('/articles', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Verificar se existem categorias
    const categories = await Category.findAll({ transaction });
    
    if (categories.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Não existem categorias para criar artigos' });
    }
    
    // Artigos de exemplo
    const sampleArticles = [
      {
        title: 'Novidades no mundo dos games em 2025',
        slug: 'novidades-games-2025',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
        summary: 'Descubra as principais novidades do mundo dos games para 2025',
        featured_image: 'default-image.jpg',
        author_id: 1, // admin
        category_id: categories[0].id,
        status: 'published'
      },
      {
        title: 'Os melhores filmes de 2024',
        slug: 'melhores-filmes-2024',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
        summary: 'Confira nossa lista com os melhores filmes lançados em 2024',
        featured_image: 'default-image.jpg',
        author_id: 1, // admin
        category_id: categories[1].id,
        status: 'published'
      },
      {
        title: 'Dicas de bem-estar para o dia a dia',
        slug: 'dicas-bem-estar',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
        summary: 'Aprenda dicas simples para melhorar seu bem-estar no dia a dia',
        featured_image: 'default-image.jpg',
        author_id: 2, // leitor
        category_id: categories[2].id,
        status: 'published'
      }
    ];
    
    // Criar artigos
    const createdArticles = [];
    for (const article of sampleArticles) {
      const newArticle = await Article.create(article, { transaction });
      createdArticles.push(newArticle);
    }
    
    await transaction.commit();
    
    return res.status(201).json({ 
      message: 'Artigos de exemplo adicionados com sucesso',
      articles: createdArticles.map(a => a.id)
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao adicionar artigos de exemplo:', error);
    return res.status(500).json({ 
      message: 'Erro ao adicionar artigos de exemplo', 
      error: error.message 
    });
  }
});

// Rota para adicionar comentários de teste diretamente com SQL
router.post('/comments', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Verificar se existem artigos
    const [articles] = await sequelize.query('SELECT id FROM articles LIMIT 3', { transaction });
    
    if (articles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Não existem artigos para criar comentários' });
    }
    
    // Inserir comentários diretamente com SQL
    await sequelize.query(`
      INSERT INTO comments (article_id, user_id, content, parent_id, created_at, updated_at)
      VALUES
      (1, 1, 'Ótimo artigo! Muito informativo.', NULL, NOW(), NOW()),
      (1, 2, 'Concordo totalmente com o autor.', NULL, NOW(), NOW()),
      (2, 1, 'Esse tema é muito relevante atualmente.', NULL, NOW(), NOW()),
      (2, 2, 'Gostaria de ver mais conteúdo sobre isso.', NULL, NOW(), NOW()),
      (3, 1, 'Interessante, mas poderia aprofundar mais.', NULL, NOW(), NOW())
    `, { transaction });
    
    // Obter IDs dos comentários inseridos
    const [comments] = await sequelize.query('SELECT id FROM comments ORDER BY id DESC LIMIT 5', { transaction });
    
    // Adicionar respostas aos comentários
    if (comments.length >= 2) {
      await sequelize.query(`
        INSERT INTO comments (article_id, user_id, content, parent_id, created_at, updated_at)
        VALUES
        (1, 1, 'Também achei muito bom!', ${comments[0].id}, NOW(), NOW()),
        (1, 2, 'Obrigado pelo feedback!', ${comments[1].id}, NOW(), NOW())
      `, { transaction });
    }
    
    await transaction.commit();
    
    return res.status(201).json({ message: 'Comentários de teste adicionados com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao adicionar comentários de teste:', error);
    return res.status(500).json({ message: 'Erro ao adicionar comentários de teste', error: error.message });
  }
});

module.exports = router;
