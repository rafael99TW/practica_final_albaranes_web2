const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const sendSlack = require('../utils/slack');

// Generar código aleatorio de 6 dígitos
const generateValidationCode = () => Math.floor(100000 + Math.random() * 900000).toString();


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Ya existe un usuario con ese correo' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const validationCode = generateValidationCode();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      validationCode
    });

    await sendEmail(email, 'Código de verificación', `Tu código es: ${validationCode}`);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Notificar a Slack
    await sendSlack(`🆕 Nuevo registro de usuario:\nNombre: *${name}*\nEmail: *${email}*`);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const validateEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.validationCode !== code) {
      return res.status(400).json({ message: 'Código incorrecto' });
    }

    user.isValidated = true;
    user.validationCode = null;
    await user.save();

    // Slack
    await sendSlack(`✅ El usuario *${user.name}* (${user.email}) validó su correo exitosamente.`);

    res.json({ message: 'Correo validado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error validando el correo' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.isDeleted) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Slack
    await sendSlack(`🔓 El usuario *${user.name}* (${user.email}) ha iniciado sesión.`);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile: req.body },
      { new: true }
    );

    await sendSlack(`📝 El usuario *${user.name}* (${user.email}) actualizó su perfil.`);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message });
  }
};

const updateCompanyData = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { company: req.body },
      { new: true }
    );

    await sendSlack(`🏢 El usuario *${user.name}* (${user.email}) actualizó los datos de su empresa.`);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar compañía', error: err.message });
  }
};

module.exports = {
  register,
  validateEmail,
  login,
  updateUserProfile,
  updateCompanyData
};