const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const authMiddleware = require('../middlewares/auth.middleware');

const userController = require('../controllers/user.controller');
const orderController = require('../controllers/order.controller');
const productController = require('../controllers/product.controller');

// Auth Routes
router.post('/auth/login', userController.user_login);
router.post('/auth/register', userController.user_registration);

// Product Routes
router.get('/products', authMiddleware, productController.fetch_all_product);
router.get('/products/:id', authMiddleware, productController.fetch_product);
router.post('/products', authMiddleware, productController.add_new_product);
router.patch('/products/:id', authMiddleware, productController.update_product);
router.delete('/products/:id', authMiddleware, productController.delete_product);

// Order Routes
router.get('/orders', authMiddleware, orderController.fetch_all_order);
router.post('/orders', authMiddleware, orderController.add_new_order);

module.exports = router;
