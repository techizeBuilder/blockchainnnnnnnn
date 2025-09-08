const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {Object} user - Mongoose user object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};

module.exports = generateToken;
