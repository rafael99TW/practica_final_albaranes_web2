/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para la gestión de clientes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         createdBy:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - address
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createClient, 
  getClients, 
  getClientById, 
  updateClient, 
  archiveClient, 
  deleteClient 
} = require('../controllers/clientController');
const { createClientValidator, clientIdValidator } = require('../validations/clientValidator');
const { validate } = require('../middleware/validate');

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Crear un nuevo cliente
 *     description: Crea un cliente con la información proporcionada.
 *     tags: [Clientes]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       500:
 *         description: Error al crear el cliente
 */
router.post('/', auth, createClientValidator, validate, createClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Obtener todos los clientes
 *     description: Obtiene todos los clientes de un usuario.
 *     tags: [Clientes]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *       500:
 *         description: Error al obtener los clientes
 */
router.get('/', auth, getClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     description: Obtiene un cliente específico mediante su ID.
 *     tags: [Clientes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al obtener el cliente
 */
router.get('/:id', auth, clientIdValidator, validate, getClientById);

/**
 * @swagger
 * /clients/{id}:
 *   patch:
 *     summary: Actualizar un cliente
 *     description: Actualiza la información de un cliente.
 *     tags: [Clientes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: string
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
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al actualizar el cliente
 */
router.patch('/:id', auth, clientIdValidator, validate, updateClient);

/**
 * @swagger
 * /clients/{id}/archive:
 *   patch:
 *     summary: Archivar un cliente
 *     description: Archiva un cliente (soft delete).
 *     tags: [Clientes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente archivado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al archivar el cliente
 */
router.patch('/:id/archive', auth, clientIdValidator, validate, archiveClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente permanentemente.
 *     tags: [Clientes]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al eliminar el cliente
 */
router.delete('/:id', auth, clientIdValidator, validate, deleteClient);

module.exports = router;
