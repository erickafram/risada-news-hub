const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');
const { authenticate } = require('../middlewares/authMiddleware');

// Rota pública para obter contagem de reações para um artigo (não requer autenticação)
router.get('/count/:articleId', reactionController.getArticleReactions);

// Todas as rotas abaixo requerem autenticação

// Rota para adicionar ou atualizar uma reação
router.post('/:articleId', authenticate, reactionController.addOrUpdateReaction);

// Rota para obter a reação do usuário para um artigo específico
router.get('/user/:articleId', authenticate, reactionController.getUserReaction);

// Rota para obter todas as reações de um usuário
router.get('/user', authenticate, reactionController.getUserReactions);

module.exports = router;
