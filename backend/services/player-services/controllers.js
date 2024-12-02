// controllers/objectController.js
const ObjectModel = require('../models/Object');

// Crear un nuevo objeto
exports.createObject = async (req, res) => {
  try {
    const { nombre, alto, ancho } = req.body;

    const newObject = new ObjectModel({ nombre, alto, ancho });
    await newObject.save();

    res.status(201).json({ message: 'Objeto creado con éxito', object: newObject });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el objeto', error: error.message });
  }
};

// Obtener todos los objetos
exports.getObjects = async (req, res) => {
  try {
    const objects = await ObjectModel.find();
    res.status(200).json(objects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los objetos', error: error.message });
  }
};

// Obtener un objeto por ID
exports.getObjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const object = await ObjectModel.findById(id);

    if (!object) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }

    res.status(200).json(object);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el objeto', error: error.message });
  }
};

// Actualizar un objeto
exports.updateObject = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, alto, ancho } = req.body;

    const updatedObject = await ObjectModel.findByIdAndUpdate(
      id,
      { nombre, alto, ancho },
      { new: true }
    );

    if (!updatedObject) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }

    res.status(200).json({ message: 'Objeto actualizado con éxito', object: updatedObject });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el objeto', error: error.message });
  }
};

// Eliminar un objeto
exports.deleteObject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedObject = await ObjectModel.findByIdAndDelete(id);

    if (!deletedObject) {
      return res.status(404).json({ message: 'Objeto no encontrado' });
    }

    res.status(200).json({ message: 'Objeto eliminado con éxito', object: deletedObject });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el objeto', error: error.message });
  }
};
