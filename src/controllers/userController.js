const { registerUser, loginUser, updateWallet, verifyOTP } = require('../services/userService');
const generateToken = require('../utils/jwt');

// Register user → OTP is sent automatically
const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        // Hide sensitive fields
        const { password, otp, otpExpires, ...userWithoutSensitive } = user.toObject();

        res.status(201).json({
            message: 'User registered successfully. OTP sent to email.',
            user: userWithoutSensitive
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login user (only if verified)
const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        const token = generateToken(user._id);

        const { password, otp, otpExpires, ...userWithoutSensitive } = user.toObject();

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userWithoutSensitive
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update wallet
const updateWalletController = async (req, res) => {
    try {
        const { userId, walletAddress } = req.body;
        console.log("userId",userId);
        
        const user = await updateWallet(userId, walletAddress);

        res.status(200).json({
            message: 'Wallet updated successfully',
            user
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Verify OTP (email verification)
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOTP(email, otp);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


module.exports = { register, login, updateWalletController, verifyEmail };
