/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Endpoints para la gestión de proyectos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         client:
 *           type: string
 *         createdBy:
 *           type: string
 *         company:
 *           type: string
 *         archived:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - client
 */


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  archiveProject, 
  unarchiveProject, 
  deleteProject 
} = require('../controllers/projectController');
const { createProjectValidator, projectIdValidator } = require('../validations/projectValidator');
const { validate } = require('../middleware/validate');

/**
 * @swagger
 * /project:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - client
 *             properties:
 *               name:
 *                 type: string
 *               client:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', auth, createProjectValidator, validate, createProject);

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Obtener todos los proyectos del usuario o su empresa
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       404:
 *         description: No se encontraron proyectos
 *       500:
 *         description: Error al obtener proyectos
 */
router.get('/', auth, getProjects);

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al obtener el proyecto
 */
router.get('/:id', auth, projectIdValidator, validate, getProjectById);

/**
 * @swagger
 * /project/{id}:
 *   put:
 *     summary: Actualizar un proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               client:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al actualizar el proyecto
 */
router.put('/:id', auth, projectIdValidator, validate, updateProject);

/**
 * @swagger
 * /project/archive/{id}:
 *   patch:
 *     summary: Archivar un proyecto (soft delete)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto archivado correctamente
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al archivar el proyecto
 */
router.patch('/archive/:id', auth, projectIdValidator, validate, archiveProject);

/**
 * @swagger
 * /project/unarchive/{id}:
 *   patch:
 *     summary: Restaurar un proyecto archivado
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto restaurado
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al restaurar el proyecto
 */
router.patch('/unarchive/:id', auth, projectIdValidator, validate, unarchiveProject);

/**
 * @swagger
 * /project/{id}:
 *   delete:
 *     summary: Eliminar un proyecto permanentemente
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado permanentemente
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al eliminar el proyecto
 */
router.delete('/:id', auth, projectIdValidator, validate, deleteProject);

module.exports = router;
