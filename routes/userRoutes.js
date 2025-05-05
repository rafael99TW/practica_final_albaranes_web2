/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         isValidated:
 *           type: boolean
 *           default: false
 *         validationCode:
 *           type: string
 *         profile:
 *           type: object
 *           properties:
 *             avatar:
 *               type: string
 *             bio:
 *               type: string
 *         company:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             phone:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - email
 *         - password
 */


const express = require('express');
const router = express.Router();
const { register, login, validateEmail, updateUserProfile, updateCompanyData } = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea un nuevo usuario con los datos proporcionados y envía un código de verificación por correo electrónico.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente y token generado
 *       400:
 *         description: Ya existe un usuario con ese correo
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Inicia sesión con las credenciales del usuario y devuelve un token JWT.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso y token generado
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error al iniciar sesión
 */
router.post('/login', login);

/**
 * @swagger
 * /users/validation:
 *   put:
 *     summary: Validar correo electrónico
 *     description: Verifica el código de validación enviado al correo electrónico del usuario.
 *     tags: [Usuarios]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código de validación de 6 dígitos
 *     responses:
 *       200:
 *         description: Correo validado correctamente
 *       400:
 *         description: Código incorrecto
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al validar el correo
 */
router.put('/validation', auth, validateEmail);

/**
 * @swagger
 * /users/:
 *   patch:
 *     summary: Actualizar perfil del usuario
 *     description: Actualiza la información del perfil del usuario.
 *     tags: [Usuarios]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       500:
 *         description: Error al actualizar el perfil
 */
router.patch('/', auth, updateUserProfile);

/**
 * @swagger
 * /users/company:
 *   patch:
 *     summary: Actualizar información de la compañía
 *     description: Actualiza los datos de la compañía asociados al usuario.
 *     tags: [Usuarios]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Información de la compañía actualizada
 *       500:
 *         description: Error al actualizar la información de la compañía
 */
router.patch('/company', auth, updateCompanyData);

module.exports = router;