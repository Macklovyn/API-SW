const express = require('express');
const router = express.Router();
const authMiddleware = require('./middlewares/authMiddleware');
const UserController = require('./controllers/UserController');
const CategoryController = require('./controllers/CategoryController');
const PropertyController = require('./controllers/PropertyController');
const MessageController = require('./controllers/MessageController');
const verifyToken = require('./middlewares/authMiddleware');


// Rutas de Usuario
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/activate/:userId', UserController.activateAccount);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

// Rutas de Categorías
router.post('/categories', verifyToken, CategoryController.create);
router.get('/categories', CategoryController.getAll);
router.get('/categories/:id', CategoryController.show);
router.put('/categories/:id', verifyToken, CategoryController.update);
router.delete('/categories/:id', verifyToken, CategoryController.delete);

// Rutas de Propiedades
router.post('/properties', verifyToken, PropertyController.create);
router.get('/properties', PropertyController.getAll);
router.get('/properties/:id', PropertyController.getById);
router.put('/properties/:id', verifyToken, PropertyController.update);
router.delete('/properties/:id', verifyToken, PropertyController.delete);

// Rutas de Mensajes
router.post('/messages', verifyToken, MessageController.create);
router.post('/message/response', verifyToken, MessageController.respondToMessage)
router.get('/messages', MessageController.getAll);
router.get('/messages/:id', PropertyController.getById);
router.put('/messages/:id', verifyToken, PropertyController.update);
router.delete('/messages/:id', verifyToken, PropertyController.delete);

module.exports = router;
