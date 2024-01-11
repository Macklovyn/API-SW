// Importación de módulos necesarios
const bcrypt = require('bcrypt'); // Librería para el hash de contraseñas
const jwt = require('jsonwebtoken'); // Librería para manejar tokens de sesión
const nodemailer = require('nodemailer'); // Librería para el envío de correos electrónicos
const { validationResult } = require('express-validator'); // Validación de datos del formulario
const { User } = require('../models'); // Modelo de usuario
const { secretKey, smtpConfig } = require('../config/config'); // Claves secretas y configuración SMTP

// Función para manejar errores y enviar respuestas JSON
const handleErrors = (res, status, message) => {
    res.status(status).json({ message });
};

// Controlador de Usuario con diferentes métodos
const UserController = {
    /**
     * Método para registrar nuevos usuarios.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con mensaje de éxito o error.
     */
    async register(req, res) {
        try {
            // Validar campos del formulario
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { name, email, password } = req.body;

            // Verificar si el correo electrónico ya está registrado
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return handleErrors(res, 400, 'El correo electrónico ya está registrado.');
            }

            // Hash de la contraseña antes de almacenarla en la base de datos
            const hashedPassword = await bcrypt.hash(password, 10);
            // Crear un nuevo usuario
            const newUser = await User.create({ name, email, password: hashedPassword });

            // Enviar correo de activación
            const activationLink = `https://api-proyectsw.onrender.comapi/activate/${newUser.id}`;
            const transporter = nodemailer.createTransport(smtpConfig);

            await transporter.sendMail({
                to: email,
                subject: 'Activa tu cuenta',
                text: `Por favor, haz clic en el siguiente enlace para activar tu cuenta: ${activationLink}`,
            });

            // Respuesta de éxito
            res.status(201).json({ message: 'Usuario registrado exitosamente. Por favor, verifica tu correo para activar tu cuenta.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para iniciar sesión de usuarios.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con mensaje de éxito o error.
     */
    async login(req, res) {
        try {
            // Validar campos del formulario
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { email, password } = req.body;

            // Buscar al usuario por correo electrónico
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return handleErrors(res, 401, 'Credenciales inválidas.');
            }

            // Verificar si la contraseña es válida
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return handleErrors(res, 401, 'Credenciales inválidas.');
            }

            // Verificar si la cuenta está activa
            if (!user.isActive) {
                return handleErrors(res, 401, 'La cuenta aún no ha sido activada.');
            }

            // Generar un token de sesión
            jwt.sign({ email: user.email, name: user.name }, secretKey, (err, token) => {
                if (err) {
                    res.status(400).send({ msg: 'Error' })
                } else {
                    res.send({ msg: 'success', token: token })
                }
            });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para activar cuentas de usuario.
     * @param {Object} req - Objeto de solicitud express con parámetro de ruta (userId).
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con mensaje de éxito o error.
     */
    async activateAccount(req, res) {
        try {
            const { userId } = req.params;

            // Buscar al usuario por ID
            const user = await User.findByPk(userId);
            if (!user) {
                return handleErrors(res, 404, 'Usuario no encontrado.');
            }

            // Verificar si la cuenta ya está activa
            if (user.isActive) {
                return handleErrors(res, 400, 'La cuenta ya está activa.');
            }

            // Activar la cuenta y obtener el nombre del usuario desde el token
            user.isActive = true;
            await user.save();

            const decodedToken = jwt.verify(user.token, secretKey);
            const userName = decodedToken.name;

            // Respuesta de éxito
            res.json({ message: `Cuenta de ${userName} activada exitosamente.` });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para solicitar el restablecimiento de contraseña.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con mensaje de éxito o error.
     */
    async forgotPassword(req, res) {
        try {
            // Validar campos del formulario
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { email } = req.body;

            // Buscar al usuario por correo electrónico
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return handleErrors(res, 404, 'Usuario no encontrado.');
            }

            // Generar un token de restablecimiento y actualizar en la base de datos
            const resetToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
            user.resetToken = resetToken;
            user.resetTokenExpiry = Date.now() + 3600000;
            await user.save();

            // Enviar correo con el enlace de restablecimiento
            const resetLink = `http://tu-domino.com/reset-password/${resetToken}`;
            const transporter = nodemailer.createTransport(smtpConfig);

            await transporter.sendMail({
                to: email,
                subject: 'Restablecer contraseña',
                text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
            });

            // Respuesta de éxito
            res.json({ message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    /**
     * Método para restablecer la contraseña después de recibir el token de restablecimiento.
     * @param {Object} req - Objeto de solicitud express.
     * @param {Object} res - Objeto de respuesta express.
     * @returns {Object} - Respuesta JSON con mensaje de éxito o error.
     */
    async resetPassword(req, res) {
        try {
            // Validar campos del formulario
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { resetToken, newPassword } = req.body;

            // Buscar al usuario por token de restablecimiento
            const user = await User.findOne({
                where: {
                    resetToken,
                },
            });

            // Verificar si el token de restablecimiento es válido
            if (!user) {
                return handleErrors(res, 400, 'Token de restablecimiento inválido.');
            }

            // Hash de la nueva contraseña y actualizar en la base de datos
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            // Respuesta de éxito
            res.json({ message: 'Contraseña restablecida exitosamente.' });
        } catch (error) {
            // Manejar errores internos del servidor
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    // Otros métodos y funciones del controlador...
};

// Exportar el controlador para su uso en otras partes de la aplicación
module.exports = UserController;

