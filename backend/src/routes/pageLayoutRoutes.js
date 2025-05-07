const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const pageLayoutController = require('../controllers/pageLayoutController');

// Rota para listar todos os layouts
router.get('/', verifyToken, isAdmin, pageLayoutController.getLayouts);

// Rota para obter layout ativo
router.get('/active', pageLayoutController.getActiveLayout);

// Rota para criar novo layout
router.post('/', verifyToken, isAdmin, pageLayoutController.createLayout);

// Rota para atualizar layout
router.put('/:id', verifyToken, isAdmin, pageLayoutController.updateLayout);

// Rota para deletar layout
router.delete('/:id', verifyToken, isAdmin, pageLayoutController.deleteLayout);

module.exports = router;
