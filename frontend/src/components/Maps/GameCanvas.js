import React, { useEffect, useRef } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';
import io from 'socket.io-client';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const player = new Player();
  const bulletManager = new BulletManager();
  let shootingInterval = null;
  const socket = useRef(null); // Socket.IO client reference

  // Estado para otros jugadores
  const players = {};

  useEffect(() => {
    // Inicializar socket
    socket.current = io('http://localhost:5000');

    // Recibir la lista de jugadores actuales al conectar
    socket.current.on('currentPlayers', (currentPlayers) => {
      Object.keys(currentPlayers).forEach((id) => {
        if (id !== socket.current.id) {
          players[id] = currentPlayers[id];
        }
      });
    });

    // Cuando se conecte un nuevo jugador
    socket.current.on('newPlayer', (data) => {
      players[data.id] = { x: data.x, y: data.y };
    });

    // Escuchar el movimiento de otros jugadores
    socket.current.on('playerMoved', (data) => {
      if (players[data.id]) {
        players[data.id] = { x: data.x, y: data.y };
      }
    });

    // Escuchar el disparo de otros jugadores
    socket.current.on('playerShot', (data) => {
      bulletManager.shoot(data.x, data.y, data.direction);
    });

    // Escuchar cuando un jugador se desconecta
    socket.current.on('playerDisconnected', (data) => {
      delete players[data.id];
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Establece el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(); // Redibujar el canvas después de cambiar el tamaño
    };

    // Dibuja el punto, las balas y el entorno
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el punto en el centro del canvas (jugador principal)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Dibujar las balas del jugador principal
      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });

      // Dibujar a otros jugadores
      ctx.fillStyle = 'blue';
      for (const id in players) {
        const otherPlayer = players[id];
        const relativeX = centerX + (otherPlayer.x - player.x);
        const relativeY = centerY + (otherPlayer.y - player.y);
        ctx.beginPath();
        ctx.arc(relativeX, relativeY, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Opcional: Dibujar un "grid" para mostrar el desplazamiento del mundo
      ctx.strokeStyle = '#ccc';
      for (let i = -canvas.width; i <= canvas.width * 2; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i - player.x % 50, 0);
        ctx.lineTo(i - player.x % 50, canvas.height);
        ctx.stroke();
      }
      for (let j = -canvas.height; j <= canvas.height * 2; j += 50) {
        ctx.beginPath();
        ctx.moveTo(0, j - player.y % 50);
        ctx.lineTo(canvas.width, j - player.y % 50);
        ctx.stroke();
      }
    };

    // Maneja el movimiento del jugador y dispara balas
    const handleKeyDown = (e) => {
      player.move(e.key);
      draw();

      // Enviar el movimiento del jugador al servidor
      socket.current.emit('playerMove', { x: player.x, y: player.y });

      // Iniciar el disparo continuo si hay una dirección de movimiento y aún no se está disparando
      if ((player.direction.x !== 0 || player.direction.y !== 0) && !shootingInterval) {
        shootingInterval = setInterval(() => {
          bulletManager.shoot(player.x + canvas.width / 2, player.y + canvas.height / 2, player.direction);
          socket.current.emit('playerShoot', {
            x: player.x + canvas.width / 2,
            y: player.y + canvas.height / 2,
            direction: player.direction,
          });
          draw();
        }, 500); // Dispara cada 500ms
      }
    };

    // Maneja cuando el jugador deja de moverse
    const handleKeyUp = (e) => {
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        player.direction = { x: 0, y: 0 }; // Deja de moverse
        if (shootingInterval) {
          clearInterval(shootingInterval); // Detener disparo
          shootingInterval = null;
        }
      }
    };

    // Actualiza las balas en cada frame
    const updateBullets = () => {
      bulletManager.updateBullets({ x: player.x, y: player.y }, canvas.width, canvas.height);
      draw();
      requestAnimationFrame(updateBullets);
    };

    // Añadir listeners para teclas y cambiar el tamaño de la ventana
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Configura el tamaño inicial del canvas

    // Iniciar la actualización continua de las balas
    updateBullets();

    // Limpiar los eventos y el intervalo al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      if (shootingInterval) clearInterval(shootingInterval);
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ display: 'block' }} />
  );
};

export default GameCanvas;
