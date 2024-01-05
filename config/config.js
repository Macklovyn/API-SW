require('dotenv').config();

module.exports = {
    secretKey: 'your_secret_key',
    smtpConfig: {
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: process.env.SMTP_PORT || 2525,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || '09426177092166',
            pass: process.env.SMTP_PASS || 'c0d72a47dcb80d',
        },
    },
};

