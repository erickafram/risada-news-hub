const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', articleController.getAllArticles);
router.get('/:identifier', articleController.getArticleByIdOrSlug);

// Rotas protegidas para administradores
router.get('/admin/all', authenticate, isAdmin, articleController.getAllArticlesAdmin);
router.post('/', authenticate, isAdmin, articleController.createArticle);
router.put('/:id', authenticate, isAdmin, articleController.updateArticle);
router.delete('/:id', authenticate, isAdmin, articleController.deleteArticle);

module.exports = router;
