/**
 * @swagger
 * tags:
 *   name: Albaranes
 *   description: Endpoints para la gestión de albaranes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Albaran:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         cliente:
 *           type: string
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               cantidad:
 *                 type: number
 *               precioUnitario:
 *                 type: number
 *         total:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - cliente
 *         - productos
 */


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createAlbaran,
  getAlbaranes,
  getAlbaranById,
  updateAlbaran,
  deleteAlbaran
} = require('../controllers/albaranController');

/**
 * @swagger
 * /albaranes:
 *   post:
 *     summary: Crear un nuevo albarán
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente
 *               - productos
 *             properties:
 *               cliente:
 *                 type: string
 *                 description: ID del cliente
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre
 *                     - cantidad
 *                     - precioUnitario
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *                     precioUnitario:
 *                       type: number
 *     responses:
 *       201:
 *         description: Albarán creado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post('/', auth, createAlbaran);

/**
 * @swagger
 * /albaranes:
 *   get:
 *     summary: Obtener todos los albaranes del usuario autenticado
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes
 *       500:
 *         description: Error del servidor
 */
router.get('/', auth, getAlbaranes);

/**
 * @swagger
 * /albaranes/{id}:
 *   get:
 *     summary: Obtener un albarán por ID
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *       404:
 *         description: Albarán no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', auth, getAlbaranById);

/**
 * @swagger
 * /albaranes/{id}:
 *   patch:
 *     summary: Actualizar un albarán existente
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *                     precioUnitario:
 *                       type: number
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Albarán actualizado
 *       404:
 *         description: Albarán no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id', auth, updateAlbaran);

/**
 * @swagger
 * /albaranes/{id}:
 *   delete:
 *     summary: Eliminar un albarán
 *     tags: [Albaranes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán eliminado correctamente
 *       404:
 *         description: Albarán no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', auth, deleteAlbaran);

module.exports = router;
