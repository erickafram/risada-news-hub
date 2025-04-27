const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Rotas públicas (acessíveis sem autenticação)
// Obter uma página pelo slug (para exibição pública)
router.get('/slug/:slug', pageController.getPageBySlug);

// Obter páginas para o menu
router.get('/menu', pageController.getMenuPages);

// Rotas protegidas (requerem autenticação e permissão de admin)
// Obter todas as páginas (com paginação e filtros)
router.get('/', verifyToken, isAdmin, pageController.getAllPages);

// Obter uma página específica pelo ID
router.get('/:id', verifyToken, isAdmin, pageController.getPageById);

// Criar uma nova página
router.post('/', verifyToken, isAdmin, pageController.createPage);

// Atualizar uma página existente
router.put('/:id', verifyToken, isAdmin, pageController.updatePage);

// Excluir uma página
router.delete('/:id', verifyToken, isAdmin, pageController.deletePage);

module.exports = router;
