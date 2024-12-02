// controllers/playerController.js
const Player = require('../models/Player');

// Crear un nuevo jugador
exports.createPlayer = async (req, res) => {
  try {
    const { nombre, puntuacion } = req.body;

    const newPlayer = new Player({ nombre, puntuacion });
    await newPlayer.save();

    res.status(201).json({ message: 'Jugador creado con éxito', player: newPlayer });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el jugador', error: error.message });
  }
};

// Obtener todos los jugadores
exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los jugadores', error: error.message });
  }
};

// Obtener un jugador por ID
exports.getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el jugador', error: error.message });
  }
};

// Actualizar un jugador
exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, puntuacion } = req.body;

    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { nombre, puntuacion },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.status(200).json({ message: 'Jugador actualizado con éxito', player: updatedPlayer });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el jugador', error: error.message });
  }
};

// Eliminar un jugador
exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.status(200).json({ message: 'Jugador eliminado con éxito', player: deletedPlayer });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el jugador', error: error.message });
  }
};
