const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Rotas para estatísticas - todas requerem autenticação e permissão de administrador

router.get('/overview', authenticate, isAdmin, analyticsController.getOverviewStats);
router.get('/content', authenticate, isAdmin, analyticsController.getContentStats);
router.get('/audience', authenticate, isAdmin, analyticsController.getAudienceStats);
router.get('/traffic-sources', authenticate, isAdmin, analyticsController.getTrafficSourceStats);

module.exports = router;
