const Client = require('../models/Client');
const { sendSlackNotification } = require('../utils/slack'); // Asegúrate de tener este helper

// Crear un cliente
const createClient = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const client = new Client({
      name,
      email,
      phone,
      address,
      createdBy: req.user.id
    });

    await client.save();

    await sendSlackNotification(`🆕 Cliente creado: ${name} (${email}) por el usuario ${req.user.id}`);

    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el cliente', error: err.message });
  }
};

// Obtener todos los clientes de un usuario
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ createdBy: req.user.id, isDeleted: false });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: err.message });
  }
};

// Obtener un cliente por su ID
const getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findOne({ _id: id, createdBy: req.user.id, isDeleted: false });
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: err.message });
  }
};

// Actualizar un cliente
const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const client = await Client.findOneAndUpdate(
      { _id: id, createdBy: req.user.id, isDeleted: false },
      { name, email, phone, address },
      { new: true }
    );

    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

    await sendSlackNotification(`✏️ Cliente actualizado: ${client.name} por el usuario ${req.user.id}`);

    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error: err.message });
  }
};

// Archivar un cliente (soft delete)
const archiveClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findOneAndUpdate(
      { _id: id, createdBy: req.user.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

    await sendSlackNotification(`📦 Cliente archivado: ${client.name} por el usuario ${req.user.id}`);

    res.status(200).json({ message: 'Cliente archivado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al archivar el cliente', error: err.message });
  }
};

// Eliminar un cliente (hard delete)
const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

    await sendSlackNotification(`🗑️ Cliente eliminado: ${client.name} por el usuario ${req.user.id}`);

    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: err.message });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  archiveClient,
  deleteClient
};