const Albaran = require('../models/Albaran');

// Crear albarán
const createAlbaran = async (req, res) => {
  const { cliente, productos } = req.body;

  try {
    let total = 0;
    productos.forEach(producto => {
      total += producto.cantidad * producto.precioUnitario;
    });

    const nuevoAlbaran = new Albaran({
      cliente,
      productos,
      total,
      usuario: req.user.id
    });

    await nuevoAlbaran.save();
    res.status(201).json(nuevoAlbaran);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear albarán', error });
  }
};

// Obtener todos los albaranes
const getAlbaranes = async (req, res) => {
  try {
    const albaranes = await Albaran.find({ usuario: req.user.id }).populate('cliente');
    res.json(albaranes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener albaranes', error });
  }
};

// Obtener un albarán por ID
const getAlbaranById = async (req, res) => {
  try {
    const albaran = await Albaran.findById(req.params.id).populate('cliente');
    if (!albaran) return res.status(404).json({ message: 'Albarán no encontrado' });

    res.json(albaran);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener albarán', error });
  }
};

// Actualizar un albarán
const updateAlbaran = async (req, res) => {
  try {
    const albaran = await Albaran.findById(req.params.id);
    if (!albaran) return res.status(404).json({ message: 'Albarán no encontrado' });

    albaran.productos = req.body.productos || albaran.productos;
    albaran.total = req.body.total || albaran.total;

    await albaran.save();
    res.json(albaran);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar albarán', error });
  }
};

// Eliminar un albarán
const deleteAlbaran = async (req, res) => {
  try {
    const albaran = await Albaran.findByIdAndDelete(req.params.id);
    if (!albaran) return res.status(404).json({ message: 'Albarán no encontrado' });

    res.json({ message: 'Albarán eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar albarán', error });
  }
};

module.exports = {
  createAlbaran,
  getAlbaranes,
  getAlbaranById,
  updateAlbaran,
  deleteAlbaran
};