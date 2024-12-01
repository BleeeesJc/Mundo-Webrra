import io from 'socket.io-client';

class ChatSocket {
  constructor(updateChatMessages) {
    this.socket = io('http://localhost:5001'); // URL del servidor de chat

    // Escuchar cuando se reciben todos los mensajes actuales del chat
    this.socket.on('currentChatMessages', (messages) => {
      updateChatMessages(messages);
    });

    // Escuchar nuevos mensajes de chat de otros jugadores
    this.socket.on('newChatMessage', (message) => {
      updateChatMessages((prev) => [...prev, message]);
    });

    // Método para enviar un mensaje al servidor
    this.sendMessage = (playerName, message) => {
      this.socket.emit('chatMessage', { playerName, message });
    };
  }

  // Método para desconectar el socket cuando no se necesite
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default ChatSocket;