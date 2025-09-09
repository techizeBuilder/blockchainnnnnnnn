const express = require('express');
const { register, login, verifyEmail, updateWalletController } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

// Protected route
router.patch('/:id/wallet', authMiddleware, updateWalletController);

module.exports = router;
