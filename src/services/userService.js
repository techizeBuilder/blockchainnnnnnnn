const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async ({ username, email, password, walletAddress }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        walletAddress: walletAddress || ''
    });

    await user.save();
    return user;
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return user;
};

const updateWallet = async (userId, walletAddress) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { walletAddress },
        { new: true }
    );
    if (!user) throw new Error('User not found');
    return user;
};

module.exports = { registerUser, loginUser, updateWallet };
