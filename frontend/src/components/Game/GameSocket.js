import io from 'socket.io-client';

class GameSocket {
  constructor(player, updatePlayers) {
    this.socket = io('http://localhost:5000'); // URL del servidor

    // Escuchar cuando se conecta otro jugador
    this.socket.on('newPlayer', (data) => {
      updatePlayers(data.id, { x: 0, y: 0 }); // Actualiza la lista de jugadores
    });

    // Escuchar movimiento de otros jugadores
    this.socket.on('playerMoved', (data) => {
      updatePlayers(data.id, { x: data.x, y: data.y });
    });

    // Escuchar disparos de otros jugadores
    this.socket.on('playerShot', (data) => {
      updatePlayers(data.id, { shooting: true, direction: data.direction });
    });

    // Escuchar desconexión de un jugador
    this.socket.on('playerDisconnected', (data) => {
      updatePlayers(data.id, null); // Remueve al jugador
    });

    // Método para enviar movimiento del jugador al servidor
    this.sendMove = (x, y) => {
      this.socket.emit('playerMove', { x, y });
    };

    // Método para enviar disparo al servidor
    this.sendShoot = (direction) => {
      this.socket.emit('playerShoot', { direction });
    };
  }
}

export default GameSocket;
