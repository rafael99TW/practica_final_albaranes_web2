const Project = require('../models/Project');
const Client = require('../models/Client');
const sendSlack = require('../utils/slack');

// Crear proyecto
const createProject = async (req, res) => {
  try {
    const { name, client } = req.body;

    if (!name || !client) {
      return res.status(400).json({ message: 'Nombre y cliente son obligatorios.' });
    }

    const existingClient = await Client.findOne({
      _id: client,
      $or: [
        { createdBy: req.user.id },
        { company: req.user.company }
      ],
      isDeleted: false,
    });

    if (!existingClient) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    const newProject = new Project({
      name,
      client,
      createdBy: req.user.id,
      company: req.user.company,
    });

    const savedProject = await newProject.save();

    await sendSlack(`📁 Proyecto creado: *${savedProject.name}* por <@${req.user.id}>`);

    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ message: 'Error al crear el proyecto.' });
  }
};

// Obtener todos los proyectos del usuario o de su compañía
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { company: req.user.company._id }
      ],
      archived: false,
    })
      .populate('client')
      .sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No se encontraron proyectos.' });
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los proyectos.' });
  }
};

  

// Obtener un proyecto por ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user.id },
        { company: req.user.company }
      ]
    }).populate('client');

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el proyecto.' });
  }
};

// Actualizar proyecto
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { createdBy: req.user.id },
          { company: req.user.company }
        ]
      },
      req.body,
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });

    await sendSlack(`✏️ Proyecto actualizado: *${project.name}* por <@${req.user.id}>`);

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el proyecto.' });
  }
};

// Archivar proyecto
const archiveProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { createdBy: req.user.id },
          { company: req.user.company }
        ]
      },
      { archived: true },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });

    await sendSlack(`📦 Proyecto archivado: *${project.name}* por <@${req.user.id}>`);

    res.json({ message: 'Proyecto archivado.', project });
  } catch (err) {
    res.status(500).json({ message: 'Error al archivar el proyecto.' });
  }
};

// Restaurar proyecto
const unarchiveProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { createdBy: req.user.id },
          { company: req.user.company }
        ]
      },
      { archived: false },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });

    await sendSlack(`🔓 Proyecto restaurado: *${project.name}* por <@${req.user.id}>`);

    res.json({ message: 'Proyecto restaurado.', project });
  } catch (err) {
    res.status(500).json({ message: 'Error al restaurar el proyecto.' });
  }
};

// Eliminar proyecto
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { createdBy: req.user.id },
        { company: req.user.company }
      ]
    });

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });

    await sendSlack(`❌ Proyecto eliminado: *${project.name}* por <@${req.user.id}>`);

    res.json({ message: 'Proyecto eliminado permanentemente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el proyecto.' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  archiveProject,
  unarchiveProject,
  deleteProject,
};
