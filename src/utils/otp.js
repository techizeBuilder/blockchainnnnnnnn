const crypto = require('crypto');
const { sendOTPEmail } = require('./emailService');

/**
 * Generate a 6-digit OTP and optionally send via email
 * @param {String} email - User email
 * @returns {Object} { otp, expiresAt }
 */
const generateOTP = async (email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send OTP via email
    if (email) {
        await sendOTPEmail(email, otp);
    }

    return { otp, expiresAt };
};

module.exports = { generateOTP };
