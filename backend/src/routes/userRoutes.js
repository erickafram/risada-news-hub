const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin, isOwnerOrAdmin } = require('../middlewares/authMiddleware');

// Todas as rotas de usuário requerem autenticação
router.use(authenticate);

// Rotas para administradores
router.get('/', isAdmin, userController.getAllUsers);
router.patch('/:id/toggle-status', isAdmin, userController.toggleUserStatus);
router.patch('/:id/promote', isAdmin, userController.promoteToAdmin);

// Rotas para o próprio usuário ou administradores
router.get('/:id', isOwnerOrAdmin('id'), userController.getUserById);
router.put('/:id', isOwnerOrAdmin('id'), userController.updateUser);
router.patch('/:id/change-password', isOwnerOrAdmin('id'), userController.changePassword);

module.exports = router;
