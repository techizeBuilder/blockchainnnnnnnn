// src/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false, // TLS via STARTTLS on port 587
  auth: {
    user: process.env.EMAIL_USER, // SMTP login
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// verify transporter on startup
(async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log('✅ Email transporter verified (ready to send)');
  } catch (err) {
    console.error('❌ Email transporter verification failed:', err);
  }
})();

/**
 * Send OTP email through Brevo SMTP
 * @param {String} to - recipient email
 * @param {String} otp - 6-digit OTP
 */
const sendOTPEmail = async (to, otp) => {
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Arbitrage Bot" <${fromAddress}>`,
    to,
    subject: 'Verify your email - Arbitrage Bot',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your OTP code is: <b>${otp}</b></p><p>It will expire in 10 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 OTP email sent to ${to} (messageId: ${info.messageId})`);
    return info;
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err);

    // Give a clearer error for the common Brevo-sender rejection
    if (err && err.response && typeof err.response === 'string' && err.response.includes('sender')) {
      throw new Error('Brevo rejected the sender. Verify your EMAIL_FROM in Brevo or authenticate your domain (SPF/DKIM).');
    }
    throw err;
  }
};

module.exports = { sendOTPEmail };
