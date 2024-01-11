require('dotenv').config();

module.exports = {
    secretKey: process.env.TOKEN_SECRET,

    smtpConfig: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 465, // Cambiado a 465 para SSL, puedes usar 587 para TLS
        secure: true, // Cambiado a true para usar SSL, puedes cambiar a false para TLS
        auth: {
            user: process.env.SMTP_USER || 'carlos.triguerosn@gmail.com',
            pass: process.env.SMTP_PASS || 'guysqmkfwyoqxpkk',
        },
    },
};
