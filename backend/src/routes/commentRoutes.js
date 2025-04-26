const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/authMiddleware');

// Rota pública para obter comentários de um artigo
router.get('/article/:articleId', commentController.getArticleComments);

// Rota pública para obter contagem de comentários de um artigo
router.get('/count/:articleId', commentController.getCommentCount);

// Rotas que requerem autenticação
router.post('/article/:articleId', authenticate, commentController.addComment);
router.delete('/:commentId', authenticate, commentController.deleteComment);

module.exports = router;
