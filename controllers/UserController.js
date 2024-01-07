const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const { secretKey, smtpConfig } = require('../config/config');

const handleErrors = (res, status, message) => {
    res.status(status).json({ message });
};

const UserController = {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return handleErrors(res, 400, 'El correo electrónico ya está registrado.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword });

            const activationLink = `http://tu-domino.com/api/activate/${newUser.id}`;
            const transporter = nodemailer.createTransport(smtpConfig);

            await transporter.sendMail({
                to: email,
                subject: 'Activa tu cuenta',
                text: `Por favor, haz clic en el siguiente enlace para activar tu cuenta: ${activationLink}`,
            });

            res.status(201).json({ message: 'Usuario registrado exitosamente. Por favor, verifica tu correo para activar tu cuenta.' });
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return handleErrors(res, 401, 'Credenciales inválidas.');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return handleErrors(res, 401, 'Credenciales inválidas.');
            }

            if (!user.isActive) {
                return handleErrors(res, 401, 'La cuenta aún no ha sido activada.');
            }

            jwt.sign(user.email, 'secret_key', (err, token) => {
                if (err) {
                    res.status(400).send({ msg: 'Error' })
                }
                else {
                    res.send({ msg: 'success', token: token })
                }
            })
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async activateAccount(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findByPk(userId);
            if (!user) {
                return handleErrors(res, 404, 'Usuario no encontrado.');
            }

            if (user.isActive) {
                return handleErrors(res, 400, 'La cuenta ya está activa.');
            }

            user.isActive = true;
            await user.save();

            res.json({ message: 'Cuenta activada exitosamente.' });
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async forgotPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { email } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return handleErrors(res, 404, 'Usuario no encontrado.');
            }

            const resetToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
            user.resetToken = resetToken;
            user.resetTokenExpiry = Date.now() + 3600000;
            await user.save();

            const resetLink = `http://tu-domino.com/reset-password/${resetToken}`;
            const transporter = nodemailer.createTransport(smtpConfig);

            await transporter.sendMail({
                to: email,
                subject: 'Restablecer contraseña',
                text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
            });

            res.json({ message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.' });
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

    async resetPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleErrors(res, 400, 'Campos inválidos o faltantes.');
            }

            const { resetToken, newPassword } = req.body;

            const user = await User.findOne({
                where: {
                    resetToken,
                },
            });

            if (!user) {
                return handleErrors(res, 400, 'Token de restablecimiento inválido.');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            res.json({ message: 'Contraseña restablecida exitosamente.' });
        } catch (error) {
            console.error(error);
            handleErrors(res, 500, 'Error interno del servidor.');
        }
    },

};

module.exports = UserController;
