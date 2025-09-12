const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generateOTP } = require('../utils/otp');

// Register user + send OTP
const registerUser = async ({ username, email, password, walletAddress }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        walletAddress: walletAddress || '',
        isVerified: false
    });

    // Generate OTP & send email
    const { otp, expiresAt } = await generateOTP(email);
    user.otp = otp;
    user.otpExpires = expiresAt;

    await user.save();
    return user;
};

// Login user (only if verified)
const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    if (!user.isVerified) {
        throw new Error('Email not verified. Please verify your account.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return user;
};

// Update wallet
const updateWallet = async (userId, walletAddress) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { walletAddress },
        { new: true }
    );
    
    if (!user) throw new Error('User not found');
    return user;
};

// Verify OTP
// utils/otpService.js
const verifyOTP = async (email, otpInput) => {
    const user = await User.findOne({ email });

    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('User already verified');
    if (user.otp !== otpInput) throw new Error('Invalid OTP');
    if (user.otpExpires < new Date()) throw new Error('OTP expired');

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return user;
};

module.exports = { registerUser, loginUser, updateWallet, verifyOTP };
