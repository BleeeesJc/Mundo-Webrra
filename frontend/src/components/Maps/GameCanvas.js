import React, { useEffect, useRef } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';
import Tiles from './Tiles';
import io from 'socket.io-client';
import TileImage1 from './FloresBlancas1.png';
import TileImage2 from './FloresRojas1.png';
import TileImage3 from './FlorMorada1.png';

import upImageSrc from '../../assets/images/characters/DpFinalSolopngArriba.png';
import downImageSrc from '../../assets/images/characters/DpFinalSolopngAbajo.png';
import leftImageSrc from '../../assets/images/characters/DpFinalSolopngIzquierda.png';
import rightImageSrc from '../../assets/images/characters/DpFinalSolopngDerecha.png';

const TILE_SIZE = 128;
const VISIBLE_TILES_X = 32;
const VISIBLE_TILES_Y = 32;

const images = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image(),
};

images.up.src = upImageSrc;
images.down.src = downImageSrc;
images.left.src = leftImageSrc;
images.right.src = rightImageSrc;

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const player = new Player();
  const bulletManager = new BulletManager();
  const tiles = new Tiles([TileImage1, TileImage2, TileImage3]);

  const socket = useRef(null); // Referencia del cliente de Socket.IO
  const players = {}; // Estado para otros jugadores
  let shootingInterval = null;

  const getPlayerImage = (direction) => {
    console.log('Dirección del jugador:', direction);  // Agrega esto para depurar
    if (!direction || (typeof direction.y === 'undefined' && typeof direction.x === 'undefined')) {
      return images.down;
    }
  
    // Verificamos la dirección
    if (direction.y === -1) return images.up;
    if (direction.y === 1) return images.down;
    if (direction.x === -1) return images.left;
    if (direction.x === 1) return images.right;
  
    return images.down;
  };


  // Inicializa la posición del jugador al centro del mapa
  player.x = (tiles.mapMatrix[0].length * TILE_SIZE) / 2;
  player.y = (tiles.mapMatrix.length * TILE_SIZE) / 2;

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
      players[data.id] = { x: data.x, y: data.y, direction: { x: 0, y: 0 } };
    });

    // Escuchar el movimiento de otros jugadores
    socket.current.on('playerMoved', (data) => {
      if (players[data.id]) {
        players[data.id] = { x: data.x, y: data.y, direction: data.direction };
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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(); // Redibujar el canvas después de cambiar el tamaño
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el mapa basado en la matriz
      tiles.draw(ctx, player.x, player.y, canvas.width, canvas.height);

      // Dibujar el jugador en el centro del canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      // Obtener la imagen del jugador y dibujarla en el centro del canvas
      const playerImage = player.getCurrentImage();
      const playerWidth = 100; // Ajusta este tamaño si es necesario
      const playerHeight = 90;
      ctx.drawImage(
        playerImage,
        centerX - playerWidth / 2,
        centerY - playerHeight / 2,
        playerWidth,
        playerHeight
      );

      // Dibujar las balas del jugador principal
      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });

      // Dibujar a otros jugadores
      for (const id in players) {
        const otherPlayer = players[id];
        const relativeX = centerX + (otherPlayer.x - player.x);
        const relativeY = centerY + (otherPlayer.y - player.y);

        // Obtener la imagen del otro jugador
        const otherPlayerImage = getPlayerImage(otherPlayer.direction); // Usar getPlayerImage para obtener la imagen
        const otherPlayerWidth = 100;  // Ajusta el tamaño según lo necesites
        const otherPlayerHeight = 90;

        ctx.drawImage(
          otherPlayerImage,
          relativeX - otherPlayerWidth / 2,
          relativeY - otherPlayerHeight / 2,
          otherPlayerWidth,
          otherPlayerHeight
        );
      }
    };

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

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        player.direction = { x: 0, y: 0 };
        if (shootingInterval) {
          clearInterval(shootingInterval);
          shootingInterval = null;
        }
      }
    };

    const updateBullets = () => {
      bulletManager.updateBullets({ x: player.x, y: player.y }, canvas.width, canvas.height);
      draw();
      requestAnimationFrame(updateBullets);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

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

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default GameCanvas;
