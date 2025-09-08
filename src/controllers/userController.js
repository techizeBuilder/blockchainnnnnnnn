const { registerUser, loginUser, updateWallet } = require('../services/userService');
const generateToken = require('../utils/jwt');

// Register
const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        const token = generateToken(user); // Use JWT utility
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update Wallet
const linkWallet = async (req, res) => {
    try {
        const { walletAddress } = req.body;
        const user = await updateWallet(req.params.id, walletAddress);
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ message: 'Wallet linked successfully', user: userWithoutPassword });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { register, login, linkWallet };
