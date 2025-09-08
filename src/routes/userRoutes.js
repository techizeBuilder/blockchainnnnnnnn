const express = require('express');
const router = express.Router();
const { register, login, linkWallet } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.patch('/:id/wallet', linkWallet);

module.exports = router;
