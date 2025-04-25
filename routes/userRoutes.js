const express = require('express');
const router = express.Router();
const { register, login, validateEmail, updateUserProfile, updateCompanyData } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/validation', auth, validateEmail);

router.patch('/', auth, updateUserProfile);
router.patch('/company', auth, updateCompanyData);

module.exports = router;