const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Lista de todos los jugadores conectados
let players = {};

io.on('connection', (socket) => {
  console.log('Nuevo jugador conectado:', socket.id);

  // Añadir nuevo jugador a la lista
  players[socket.id] = { x: 0, y: 0 };

  // Enviar al jugador que se conecta la lista de todos los jugadores actuales
  socket.emit('currentPlayers', players);

  // Notificar a todos los jugadores excepto al nuevo sobre la conexión
  socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

  // Escuchar el movimiento del jugador y reenviar a otros jugadores
  socket.on('playerMove', (data) => {
    if (players[socket.id]) {
      players[socket.id] = { x: data.x, y: data.y };
      socket.broadcast.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
    }
  });

  // Escuchar el disparo del jugador y reenviar a otros jugadores
  socket.on('playerShoot', (data) => {
    socket.broadcast.emit('playerShot', { id: socket.id, x: data.x, y: data.y, direction: data.direction });
  });

  // Manejar desconexión del jugador
  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
    delete players[socket.id];
    socket.broadcast.emit('playerDisconnected', { id: socket.id });
  });
});

// Iniciar el servidor en el puerto 5000
server.listen(5000, () => {
  console.log('Game Service está ejecutándose en el puerto 5000');
});
