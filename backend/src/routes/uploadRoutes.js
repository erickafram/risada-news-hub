const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Rota para upload de imagem (requer apenas autenticação)
router.post(
  '/image', 
  verifyToken, 
  uploadController.uploadSingle, 
  uploadController.handleMulterError,
  uploadController.uploadImage
);

module.exports = router;
