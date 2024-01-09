// Importar el módulo dotenv para cargar variables de entorno desde un archivo .env
require('dotenv').config();

// Configuración de la aplicación, incluyendo la clave secreta y la configuración del servidor SMTP
module.exports = {
    // Clave secreta utilizada para firmar tokens JWT (debes cambiar esto en un entorno de producción)
    secretKey: 'your_secret_key',

    // Configuración del servidor SMTP para enviar correos electrónicos
    smtpConfig: {
        // Host del servidor SMTP (se puede configurar mediante la variable de entorno SMTP_HOST)
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',

        // Puerto del servidor SMTP (se puede configurar mediante la variable de entorno SMTP_PORT)
        port: process.env.SMTP_PORT || 2525,

        // Indica si la conexión con el servidor SMTP debe ser segura (se puede configurar mediante la variable de entorno SMTP_SECURE)
        secure: false,

        // Autenticación para el servidor SMTP, utilizando las variables de entorno SMTP_USER y SMTP_PASS
        auth: {
            user: process.env.SMTP_USER || '09426177092166',
            pass: process.env.SMTP_PASS || 'c0d72a47dcb80d',
        },
    },
};
