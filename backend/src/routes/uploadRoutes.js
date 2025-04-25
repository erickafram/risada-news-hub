const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Rota para upload de imagem (requer autenticação e permissão de admin)
router.post(
  '/image', 
  verifyToken, 
  isAdmin, 
  uploadController.uploadSingle, 
  uploadController.handleMulterError,
  uploadController.uploadImage
);

module.exports = router;
