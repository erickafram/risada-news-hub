const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Rotas públicas (acessíveis sem autenticação)
// Obter configurações públicas (aparência, etc.)
router.get('/public/appearance', (req, res) => {
  settingController.getSettingsByGroup({ ...req, params: { group: 'appearance' } }, res);
});

// Rotas protegidas (requerem autenticação)
// Obter todas as configurações
router.get('/', verifyToken, isAdmin, settingController.getAllSettings);

// Obter configurações por grupo
router.get('/group/:group', verifyToken, isAdmin, settingController.getSettingsByGroup);

// Obter uma configuração específica
router.get('/:key', verifyToken, isAdmin, settingController.getSetting);

// Atualizar várias configurações de uma vez
router.put('/', verifyToken, isAdmin, settingController.updateSettings);

// Atualizar uma configuração específica
router.put('/:key', verifyToken, isAdmin, settingController.updateSetting);

// Restaurar configurações padrão
router.post('/reset', verifyToken, isAdmin, settingController.resetSettings);

module.exports = router;
