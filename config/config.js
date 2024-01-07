require('dotenv').config();

module.exports = {
    secretKey: 'your_secret_key',
    smtpConfig: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || 'your_smtp_user',
            pass: process.env.SMTP_PASS || 'your_smtp_password',
        },
    },
};
