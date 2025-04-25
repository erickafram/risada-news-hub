const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', categoryController.getAllCategories);
router.get('/:identifier', categoryController.getCategoryByIdOrSlug);

// Rotas protegidas para administradores
router.get('/admin/all', authenticate, isAdmin, categoryController.getAllCategoriesAdmin);
router.post('/', authenticate, isAdmin, categoryController.createCategory);
router.put('/:id', authenticate, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;
