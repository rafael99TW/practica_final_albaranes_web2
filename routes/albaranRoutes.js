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

router.post('/', auth, createAlbaran);
router.get('/', auth, getAlbaranes);
router.get('/:id', auth, getAlbaranById);
router.patch('/:id', auth, updateAlbaran);
router.delete('/:id', auth, deleteAlbaran);

module.exports = router;
