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

// Lista de todos los mensajes del chat
let chatMessages = [];

io.on('connection', (socket) => {
  console.log('Nuevo jugador conectado:', socket.id);

  // Enviar al jugador que se conecta la lista de todos los mensajes actuales
  socket.emit('currentChatMessages', chatMessages);

  // Escuchar mensajes de chat del jugador y reenviar a todos los jugadores
  socket.on('chatMessage', (data) => {
    const message = { playerName: data.playerName, message: data.message };
    chatMessages.push(message);
    io.emit('newChatMessage', message); // Enviar el mensaje a todos los jugadores
  });

  // Manejar desconexión del jugador
  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
  });
});

// Iniciar el servidor en el puerto 5001
server.listen(5001, () => {
  console.log('Chat Service está ejecutándose en el puerto 5001');
});
