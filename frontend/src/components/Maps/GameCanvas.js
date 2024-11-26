import React, { useEffect, useRef } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';
import Tiles from './Tiles';
import io from 'socket.io-client';
import TileImage1 from './FloresBlancas1.png';
import TileImage2 from './FloresRojas1.png';
import TileImage3 from './FlorMorada1.png';
import enemyImageSrc from './emegigoDeFuergo1.png';

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

const enemyImage = new Image();
enemyImage.src = enemyImageSrc; // Cargar la imagen del enemigo
const MIN_ENEMY_SPEED = 1; // Velocidad mínima de los enemigos
const MAX_ENEMY_SPEED = 3; // Velocidad máxima de los enemigos

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const player = new Player();
  const bulletManager = new BulletManager();
  const tiles = new Tiles([TileImage1, TileImage2, TileImage3]);

  const socket = useRef(null);
  const players = {};
  const enemies = []; // Arreglo para los enemigos
  let shootingInterval = null;

  // Initialize player position
  player.x = (tiles.mapMatrix[0].length * TILE_SIZE) / 2;
  player.y = (tiles.mapMatrix.length * TILE_SIZE) / 2;

  const spawnEnemy = () => {
    const distance = 300; // Distancia mínima desde el jugador
    const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio
    const speed = Math.random() * (MAX_ENEMY_SPEED - MIN_ENEMY_SPEED) + MIN_ENEMY_SPEED; // Velocidad aleatoria
    const enemy = {
      x: player.x + distance * Math.cos(angle),
      y: player.y + distance * Math.sin(angle),
      width: 50,
      height: 50,
      speed: speed, // Velocidad específica del enemigo
    };
    enemies.push(enemy);
  };

  const updateEnemies = () => {
    enemies.forEach((enemy) => {
      // Calcular la dirección hacia el jugador
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normalizar el vector de movimiento
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Actualizar la posición del enemigo con su velocidad específica
      enemy.x += dirX * enemy.speed;
      enemy.y += dirY * enemy.speed;
    });
  };

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
    
      // Coordenadas para centrar al jugador
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
    
      // Dibujar jugador
      const playerImage = player.getCurrentImage();
      ctx.drawImage(
        playerImage,
        centerX - player.width / 2,
        centerY - player.height / 2,
        player.width,
        player.height
      );
    
      // Dibujar hitbox del jugador
      const hitbox = player.getHitbox();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Rojo semitransparente
      ctx.fillRect(
        centerX - player.hitboxWidth / 2,
        centerY - player.hitboxHeight / 2,
        player.hitboxWidth,
        player.hitboxHeight
      );
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        centerX - player.hitboxWidth / 2,
        centerY - player.hitboxHeight / 2,
        player.hitboxWidth,
        player.hitboxHeight
      );

      // Dibujar enemigos
      enemies.forEach((enemy) => {
        const relativeX = centerX + (enemy.x - player.x);
        const relativeY = centerY + (enemy.y - player.y);

        ctx.drawImage(
          enemyImage,
          relativeX - enemy.width / 2,
          relativeY - enemy.height / 2,
          enemy.width,
          enemy.height
        );
      });
    
      // Dibujar balas
      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });
    
      // Dibujar otros jugadores
      for (const id in players) {
        const otherPlayer = players[id];
        const relativeX = centerX + (otherPlayer.x - player.x);
        const relativeY = centerY + (otherPlayer.y - player.y);
    
        ctx.drawImage(
          images.down,
          relativeX - 50, // Mitad del ancho de otro jugador
          relativeY - 45, // Mitad del alto de otro jugador
          100,
          90
        );
      }
    };
    
    
    const handleKeyDown = (e) => {
      pressedKeys[e.key] = true;
    
      // Direcciones basadas en las teclas presionadas
      const rawDirection = {
        x: (pressedKeys['ArrowRight'] ? 1 : 0) - (pressedKeys['ArrowLeft'] ? 1 : 0),
        y: (pressedKeys['ArrowDown'] ? 1 : 0) - (pressedKeys['ArrowUp'] ? 1 : 0),
      };
    
      // Normalizar la dirección para el movimiento
      const normalizedDirection = { ...rawDirection };
      const magnitude = Math.sqrt(rawDirection.x ** 2 + rawDirection.y ** 2);
      if (magnitude > 0) {
        normalizedDirection.x /= magnitude;
        normalizedDirection.y /= magnitude;
      }
    
      player.move(normalizedDirection);
    
      // Actualizar la dirección "sin normalizar" para la imagen
      player.setRawDirection(rawDirection);
    
      draw();
    
      socket.current.emit('playerMove', { x: player.x, y: player.y });
    
      if ((rawDirection.x !== 0 || rawDirection.y !== 0) && !shootingInterval) {
        shootingInterval = setInterval(() => {
          bulletManager.shoot(
            player.x,
            player.y,
            rawDirection, // Usar dirección sin normalizar para las balas
            canvas.width,
            canvas.height,
            100,
            90
          );
          socket.current.emit('playerShoot', {
            x: player.x,
            y: player.y,
            direction: rawDirection, // Emitir dirección sin normalizar
          });
          draw();
        }, 500);
      }
    };   

    const handleKeyUp = (e) => {
      delete pressedKeys[e.key];
    
      const rawDirection = {
        x: (pressedKeys['ArrowRight'] ? 1 : 0) - (pressedKeys['ArrowLeft'] ? 1 : 0),
        y: (pressedKeys['ArrowDown'] ? 1 : 0) - (pressedKeys['ArrowUp'] ? 1 : 0),
      };
    
      const normalizedDirection = { ...rawDirection };
      const magnitude = Math.sqrt(rawDirection.x ** 2 + rawDirection.y ** 2);
      if (magnitude > 0) {
        normalizedDirection.x /= magnitude;
        normalizedDirection.y /= magnitude;
      }
    
      player.move(normalizedDirection);
      player.setRawDirection(rawDirection);
    
      draw();
    
      if (normalizedDirection.x === 0 && normalizedDirection.y === 0 && shootingInterval) {
        clearInterval(shootingInterval);
        shootingInterval = null;
      }
    };

    const updateBullets = () => {
      bulletManager.updateBullets({ x: player.x, y: player.y }, canvas.width, canvas.height);
      draw();
      requestAnimationFrame(updateBullets);
    };

    const updateGame = () => {
      updateEnemies(); // Actualizar posición de los enemigos
      bulletManager.updateBullets({ x: player.x, y: player.y }, canvas.width, canvas.height);
      draw();
      requestAnimationFrame(updateGame);
    };

    const spawnEnemiesInterval = setInterval(() => {
      if (enemies.length < 10) { // Limitar la cantidad de enemigos en el mapa
        spawnEnemy();
      }
    }, 2000); // Aparecen nuevos enemigos cada 2 segundos

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
    updateGame();

    return () => {
      clearInterval(spawnEnemiesInterval);
    };

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
