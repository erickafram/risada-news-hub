const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken } = require('../middleware/authMiddleware');

// Rota para configurações públicas (sem autenticação)
router.get('/public/appearance', settingsController.getPublicSettings);

// Rotas que exigem autenticação
router.get('/', verifyToken, settingsController.getAllSettings);
router.get('/group/:group', verifyToken, settingsController.getSettingsByGroup);
router.put('/', verifyToken, settingsController.updateSettings);

module.exports = router;
