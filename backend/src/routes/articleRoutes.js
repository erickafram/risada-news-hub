const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', articleController.getAllArticles);

// Rotas protegidas (apenas para administradores)
// IMPORTANTE: Rotas específicas devem vir antes das rotas com parâmetros dinâmicos
router.get('/admin/all', authenticate, isAdmin, articleController.getAllArticlesAdmin);
router.post('/', authenticate, isAdmin, articleController.createArticle);
router.put('/:id', authenticate, isAdmin, articleController.updateArticle);
router.delete('/:id', authenticate, isAdmin, articleController.deleteArticle);

// Rota para obter um artigo específico - acessível para todos, mas com verificação de permissão no controller
router.get('/:identifier', articleController.getArticleByIdOrSlug);

module.exports = router;
