const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { verifyToken } = require('../middleware/authMiddleware');

// Todas as rotas de favoritos requerem autenticação
router.use(verifyToken);

// Adicionar um artigo aos favoritos
router.post('/', favoriteController.addFavorite);

// Remover um artigo dos favoritos
router.delete('/:articleId', favoriteController.removeFavorite);

// Listar artigos favoritos do usuário
router.get('/', favoriteController.getUserFavorites);

// Verificar se um artigo está nos favoritos do usuário
router.get('/check/:articleId', favoriteController.checkFavorite);

module.exports = router;
