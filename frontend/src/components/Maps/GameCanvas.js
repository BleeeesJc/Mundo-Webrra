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

  const socket = useRef(null);
  const players = {};
  let shootingInterval = null;

  // Initialize player position
  player.x = (tiles.mapMatrix[0].length * TILE_SIZE) / 2;
  player.y = (tiles.mapMatrix.length * TILE_SIZE) / 2;

  useEffect(() => {
    const pressedKeys = {};

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // Dibujar mapa
      tiles.draw(ctx, player.x, player.y, canvas.width, canvas.height);
    
      // Dibujar jugador en el centro del canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const playerImage = player.getCurrentImage();
      const playerWidth = 100;
      const playerHeight = 90;
      ctx.drawImage(
        playerImage,
        centerX - playerWidth / 2,
        centerY - playerHeight / 2,
        playerWidth,
        playerHeight
      );
    
      // Dibujar balas
      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });
    
      // Dibujar otros jugadores
      for (const id in players) {
        const otherPlayer = players[id];
        const relativeX = centerX + (otherPlayer.x - player.x);
        const relativeY = centerY + (otherPlayer.y - player.y);
    
        const otherPlayerImage = images.down; // Imagen por defecto, cambiar según sea necesario
        const otherPlayerWidth = 100;
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
      pressedKeys[e.key] = true;

      const direction = {
        x: (pressedKeys['ArrowRight'] ? 1 : 0) - (pressedKeys['ArrowLeft'] ? 1 : 0),
        y: (pressedKeys['ArrowDown'] ? 1 : 0) - (pressedKeys['ArrowUp'] ? 1 : 0),
      };

      player.move(direction);
      draw();

      socket.current.emit('playerMove', { x: player.x, y: player.y });

      if ((direction.x !== 0 || direction.y !== 0) && !shootingInterval) {
        shootingInterval = setInterval(() => {
          bulletManager.shoot(player.x, player.y, direction, canvas.width, canvas.height, 100, 90);
          socket.current.emit('playerShoot', {
            x: player.x,
            y: player.y,
            direction,
          });
          draw();
        }, 500);
      }
    };

    const handleKeyUp = (e) => {
      delete pressedKeys[e.key];

      const direction = {
        x: (pressedKeys['ArrowRight'] ? 1 : 0) - (pressedKeys['ArrowLeft'] ? 1 : 0),
        y: (pressedKeys['ArrowDown'] ? 1 : 0) - (pressedKeys['ArrowUp'] ? 1 : 0),
      };

      player.move(direction);
      draw();

      if (direction.x === 0 && direction.y === 0 && shootingInterval) {
        clearInterval(shootingInterval);
        shootingInterval = null;
      }
    };

    const updateBullets = () => {
      bulletManager.updateBullets({ x: player.x, y: player.y }, canvas.width, canvas.height);
      draw();
      requestAnimationFrame(updateBullets);
    };

    // Initialize socket
    socket.current = io('http://localhost:5000');
    socket.current.on('currentPlayers', (currentPlayers) => {
      Object.keys(currentPlayers).forEach((id) => {
        if (id !== socket.current.id) {
          players[id] = currentPlayers[id];
        }
      });
    });

    socket.current.on('newPlayer', (data) => {
      players[data.id] = { x: data.x, y: data.y, direction: { x: 0, y: 0 } };
    });

    socket.current.on('playerMoved', (data) => {
      if (players[data.id]) {
        players[data.id] = { x: data.x, y: data.y, direction: data.direction };
      }
    });

    socket.current.on('playerShot', (data) => {
      bulletManager.shoot(data.x, data.y, data.direction);
    });

    socket.current.on('playerDisconnected', (data) => {
      delete players[data.id];
    });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    updateBullets();

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
