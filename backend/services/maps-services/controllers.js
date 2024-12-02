// controllers/mapController.js
const Map = require('../models/Map');

// Crear un nuevo mapa
exports.createMap = async (req, res) => {
  try {
    const { tile, alto, ancho } = req.body;

    const newMap = new Map({ tile, alto, ancho });
    await newMap.save();

    res.status(201).json({ message: 'Mapa creado con éxito', map: newMap });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el mapa', error: error.message });
  }
};

// Obtener todos los mapas
exports.getMaps = async (req, res) => {
  try {
    const maps = await Map.find();
    res.status(200).json(maps);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mapas', error: error.message });
  }
};

// Obtener un mapa por ID
exports.getMapById = async (req, res) => {
  try {
    const { id } = req.params;
    const map = await Map.findById(id);

    if (!map) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }

    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el mapa', error: error.message });
  }
};

// Actualizar un mapa
exports.updateMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { tile, alto, ancho } = req.body;

    const updatedMap = await Map.findByIdAndUpdate(
      id,
      { tile, alto, ancho },
      { new: true }
    );

    if (!updatedMap) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }

    res.status(200).json({ message: 'Mapa actualizado con éxito', map: updatedMap });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el mapa', error: error.message });
  }
};

// Eliminar un mapa
exports.deleteMap = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMap = await Map.findByIdAndDelete(id);

    if (!deletedMap) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }

    res.status(200).json({ message: 'Mapa eliminado con éxito', map: deletedMap });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mapa', error: error.message });
  }
};
