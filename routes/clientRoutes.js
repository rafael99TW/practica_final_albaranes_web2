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

router.post('/', auth, createClient);
router.get('/', auth, getClients);
router.get('/:id', auth, getClientById);
router.patch('/:id', auth, updateClient);
router.patch('/:id/archive', auth, archiveClient);
router.delete('/:id', auth, deleteClient);

module.exports = router;
