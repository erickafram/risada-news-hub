const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middlewares/authMiddleware');

// Rota para obter estatísticas do dashboard (protegida por autenticação)
router.get('/dashboard', authenticate, statsController.getDashboardStats);

module.exports = router;
