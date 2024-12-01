import React, { useEffect, useRef } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';
import Tiles from './Tiles';
import io from 'socket.io-client';
import TileImage1 from './FloresBlancas1.png';
import TileImage2 from './FloresRojas1.png';
import TileImage3 from './FlorMorada1.png';
import enemyImageSrc from './candeFuego.png';
import cactusImageSrc from '../../../src/assets/images/obstaculos/cactus.png';

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
enemyImage.src = enemyImageSrc;
const cactusImage = new Image();
cactusImage.src = cactusImageSrc;

const MIN_ENEMY_SPEED = 0.5;
const MAX_ENEMY_SPEED = 1.8;

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const player = new Player();
  const bulletManager = new BulletManager();
  const tiles = new Tiles([TileImage1, TileImage2, TileImage3]);

  const socket = useRef(null);
  const players = {};
  const enemies = [];
  const obstacles = []; // Arreglo para los obstáculos
  let shootingInterval = null;

  // Initialize player position
  player.x = (tiles.mapMatrix[0].length * TILE_SIZE) / 2;
  player.y = (tiles.mapMatrix.length * TILE_SIZE) / 2;

  // Función para generar enemigos con hitbox
  const spawnEnemy = () => {
    const distance = 300;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (MAX_ENEMY_SPEED - MIN_ENEMY_SPEED) + MIN_ENEMY_SPEED;
    const enemy = {
      x: player.x + distance * Math.cos(angle),
      y: player.y + distance * Math.sin(angle),
      width: 50,
      height: 50,
      speed: speed,
      hitbox: {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
      },
    };
    enemies.push(enemy);
  };

  // Función para generar obstáculos
  const spawnObstacle = () => {
    const distance = 400;
    const angle = Math.random() * Math.PI * 2;
    const obstacle = {
      x: player.x + distance * Math.cos(angle),
      y: player.y + distance * Math.sin(angle),
      width: 50,
      height: 100,
      hitbox: {
        x: 0,
        y: 0,
        width: 50,
        height: 100,
      },
    };
    obstacles.push(obstacle);
  };

  const updateEnemies = () => {
    const enemiesToRemove = [];
    const bulletsToRemove = [];

    enemies.forEach((enemy, enemyIndex) => {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const dirX = dx / distance;
      const dirY = dy / distance;

      enemy.x += dirX * enemy.speed;
      enemy.y += dirY * enemy.speed;

      enemy.hitbox.x = enemy.x - enemy.width / 2;
      enemy.hitbox.y = enemy.y - enemy.height / 2;

      if (checkCollision(enemy.hitbox, player.getHitbox())) {
        console.log("Colisión con el jugador");
      }

      bulletManager.bullets.forEach((bullet, bulletIndex) => {
        if (checkCollision(enemy.hitbox, bullet.hitbox)) {
          console.log("Enemigo eliminado por bala");
          enemiesToRemove.push(enemyIndex);
          bulletsToRemove.push(bulletIndex);
        }
      });      
    });

    enemiesToRemove.forEach((enemyIndex) => {
      enemies.splice(enemyIndex, 1);
    });

    bulletsToRemove.forEach((bulletIndex) => {
      bulletManager.bullets.splice(bulletIndex, 1);
    });
  };

  const updateObstacles = () => {
    obstacles.forEach((obstacle) => {
      obstacle.hitbox.x = obstacle.x - obstacle.width / 2;
      obstacle.hitbox.y = obstacle.y - obstacle.height / 2;

      if (checkCollision(obstacle.hitbox, player.getHitbox())) {
        console.log("Colisión con obstáculo");
        player.x -= player.rawDirection.x * 10; // Retroceder al jugador al detectar colisión
        player.y -= player.rawDirection.y * 10;
      }
    });
  };

  const checkCollision = (rect1, rect2) => {
    if (!rect1 || !rect2) return false;

    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
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

      tiles.draw(ctx, player.x, player.y, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const playerImage = player.getCurrentImage();
      ctx.drawImage(
        playerImage,
        centerX - player.width / 2,
        centerY - player.height / 2,
        player.width,
        player.height
      );

      const hitbox = player.getHitbox();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
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

        ctx.strokeStyle = "red";
        ctx.strokeRect(
          relativeX - enemy.width / 2,
          relativeY - enemy.height / 2,
          enemy.width,
          enemy.height
        );
      });

      obstacles.forEach((obstacle) => {
        const relativeX = centerX + (obstacle.x - player.x);
        const relativeY = centerY + (obstacle.y - player.y);

        ctx.drawImage(
          cactusImage,
          relativeX - obstacle.width / 2,
          relativeY - obstacle.height / 2,
          obstacle.width,
          obstacle.height
        );

        ctx.strokeStyle = "green";
        ctx.strokeRect(
          relativeX - obstacle.width / 2,
          relativeY - obstacle.height / 2,
          obstacle.width,
          obstacle.height
        );
      });

      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });

      for (const id in players) {
        const otherPlayer = players[id];
        const relativeX = centerX + (otherPlayer.x - player.x);
        const relativeY = centerY + (otherPlayer.y - player.y);

        ctx.drawImage(
          images.down,
          relativeX - 50,
          relativeY - 45,
          100,
          90
        );
      }
    };

    const handleKeyDown = (e) => {
      pressedKeys[e.key] = true;
  
      const rawDirection = {
        x: (pressedKeys['ArrowRight'] ? 1 : 0) - (pressedKeys['ArrowLeft'] ? 1 : 0),
        y: (pressedKeys['ArrowDown'] ? 1 : 0) - (pressedKeys['ArrowUp'] ? 1 : 0),
      };
  
      // Movemos y actualizamos la dirección del jugador
      player.move(rawDirection);
      player.setRawDirection(rawDirection);
  
      // Iniciar intervalo de disparo si no está ya iniciado
      if (!shootingInterval) {
        shootingInterval = setInterval(() => {
          // Recalculamos la dirección actual al momento de disparar
          const shootDirection = { ...player.rawDirection };
  
          // Si el jugador no se está moviendo, no disparamos
          if (shootDirection.x !== 0 || shootDirection.y !== 0) {
            bulletManager.shoot(
              player.x,
              player.y,
              shootDirection,
              canvas.width,
              canvas.height,
              100,
              90
            );
          }
        }, 200); // Dispara cada 200 ms (ajusta este valor según prefieras)
      }
  
      // Emitir evento al servidor si es necesario
      socket.current.emit('playerMove', { x: player.x, y: player.y });
    };

    const handleKeyUp = (e) => {
      delete pressedKeys[e.key];
  
      const rawDirection = {
        x: (pressedKeys['ArrowRight'] ? 1 : 0) - (pressedKeys['ArrowLeft'] ? 1 : 0),
        y: (pressedKeys['ArrowDown'] ? 1 : 0) - (pressedKeys['ArrowUp'] ? 1 : 0),
      };
  
      // Movemos y actualizamos la dirección del jugador
      player.move(rawDirection);
      player.setRawDirection(rawDirection);
  
      draw();
  
      // Si no hay teclas de dirección presionadas, detener el intervalo de disparo
      if (
        !pressedKeys['ArrowUp'] &&
        !pressedKeys['ArrowDown'] &&
        !pressedKeys['ArrowLeft'] &&
        !pressedKeys['ArrowRight']
      ) {
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

    const updateGame = () => {
      updateEnemies();
      updateObstacles();
      bulletManager.updateBullets({ x: player.x, y: player.y }, canvas.width, canvas.height);
      draw();
      requestAnimationFrame(updateGame);
    };

    const spawnEnemiesInterval = setInterval(() => {
      if (enemies.length < 10) {
        spawnEnemy();
      }
    }, 2000);

    const spawnObstaclesInterval = setInterval(() => {
      if (obstacles.length < 5) {
        spawnObstacle();
      }
    }, 5000);

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
      clearInterval(spawnObstaclesInterval);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default GameCanvas;
