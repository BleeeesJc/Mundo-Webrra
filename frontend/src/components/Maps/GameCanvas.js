import React, { useEffect, useRef, useState } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';
import Tiles from './Tiles';
import io from 'socket.io-client';
import TileImage1 from './FloresBlancas1.png';
import TileImage2 from './FloresRojas1.png';
import TileImage3 from './FlorMorada1.png';
import enemyImageSrc from './candeFuego.png';
import cactusImageSrc from '../../../src/assets/images/obstaculos/cactus.png';
import chatIconSrc from './chat-icono.png';
import ChatSocket from '../Chat/Chat';

import '../../styles/chat.css';
import '../../styles/pixel.css';
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

  const gameSocket = useRef(null);
  const chatSocket = useRef(null);
  const socket = useRef(null);
  const players = {};
  const enemies = [];
  const obstacles = []; // Arreglo para los obstáculos
  let shootingInterval = null;

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Initialize player position
  player.x = (tiles.mapMatrix[0].length * TILE_SIZE) / 2;
  player.y = (tiles.mapMatrix.length * TILE_SIZE) / 2;
  const playerName = localStorage.getItem('playerName');

  const handleChatIconClick = () => {
    setShowChat((prev) => !prev);
  };

  const handleChatInput = (e) => {
    setChatInput(e.target.value);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim() !== '') {
      chatSocket.current.sendMessage(playerName, chatInput);
      setChatInput('');
    }
  };

  // Función para dibujar el nombre del jugador
  const drawPlayerName = (ctx, canvas) => {
    ctx.font = '25px "Press Start 2P"'; // Aumenta el tamaño de la fuente
    ctx.fillStyle = 'black';
    const textWidth = ctx.measureText(playerName).width;
    const xPosition = (canvas.width - textWidth) / 2; // Centrar horizontalmente
    const yPosition = canvas.height / 2 - 50; // Mover más arriba
    ctx.fillText(playerName, xPosition, yPosition);
  };


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
      health: 100, // Vida inicial del enemigo
      maxHealth: 100, // Máxima vida para referencia
      hitbox: { x: 0, y: 0, width: 50, height: 50 },
      lastAttackTime: 0, // Inicializamos el tiempo del último ataque

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
  
    const currentTime = Date.now(); // Tiempo actual en milisegundos
  
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
  
      // Verificar colisión con el jugador
      if (checkCollision(enemy.hitbox, player.getHitbox())) {
        if (!enemy.lastAttackTime || currentTime - enemy.lastAttackTime >= 2000) {
          // Han pasado al menos 2 segundos desde el último ataque
          console.log("Enemigo golpeó al jugador");
          player.reduceHealth(5); // Restar 5 de vida al jugador
          enemy.lastAttackTime = currentTime; // Actualizar el tiempo del último ataque
  
          if (player.health <= 0) {
            console.log("Jugador ha muerto");
            // Lógica para game over
          }
        }
      }
  
      bulletManager.bullets.forEach((bullet, bulletIndex) => {
        if (checkCollision(enemy.hitbox, bullet.hitbox)) {
          console.log("Enemigo alcanzado por bala");
          enemy.health -= 25; // Reducir salud por cada impacto
          bulletsToRemove.push(bulletIndex);
  
          if (enemy.health <= 0) {
            enemiesToRemove.push(enemyIndex);
          }
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
  const drawPlayerHealthBar = (ctx, canvas) => {
    const healthBarWidth = 100; // Ancho de la barra de vida
    const healthBarHeight = 10; // Altura de la barra de vida
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
  
    const healthBarX = centerX - healthBarWidth / 2;
    const healthBarY = centerY + player.height / 2 + 10; // Debajo del jugador
  
    // Dibujar la barra de vida vacía (roja)
    ctx.fillStyle = "red";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
  
    // Dibujar la barra de vida actual (verde)
    ctx.fillStyle = "green";
    ctx.fillRect(
      healthBarX,
      healthBarY,
      (player.health / player.maxHealth) * healthBarWidth,
      healthBarHeight
    );
  
    // Dibujar el borde de la barra de vida
    ctx.strokeStyle = "black";
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
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

      // Dibujar mapa
      tiles.draw(ctx, player.x, player.y, canvas.width, canvas.height);

      // Dibujar jugador en el centro del canvas
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

      drawPlayerHealthBar(ctx, canvas);


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
      
        // Dibujar al enemigo
        ctx.drawImage(
          enemyImage,
          relativeX - enemy.width / 2,
          relativeY - enemy.height / 2,
          enemy.width,
          enemy.height
        );
      
        // Dibujar la barra de vida encima del enemigo
        const healthBarWidth = enemy.width;
        const healthBarHeight = 5;
        const healthBarX = relativeX - healthBarWidth / 2;
        const healthBarY = relativeY - enemy.height / 2 - 10;
      
        ctx.fillStyle = "red";
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
      
        ctx.fillStyle = "green";
        ctx.fillRect(
          healthBarX,
          healthBarY,
          (enemy.health / enemy.maxHealth) * healthBarWidth,
          healthBarHeight
        );
      
        ctx.strokeStyle = "black";
        ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
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

      // Dibujar nombre del jugador
      drawPlayerName(ctx, canvas);

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
            rawDirection,
            canvas.width,
            canvas.height,
            100,
            90
          );
          socket.current.emit('playerShoot', {
            x: player.x,
            y: player.y,
            direction: rawDirection,
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

    gameSocket.current = io('http://localhost:5000');
    chatSocket.current = new ChatSocket(setChatMessages);

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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      if (shootingInterval) clearInterval(shootingInterval);
      if (socket.current) socket.current.disconnect();
      if (gameSocket.current) gameSocket.current.disconnect();
      if (chatSocket.current) chatSocket.current.disconnect();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <img
        src={chatIconSrc}
        alt="frontend\src\components\Maps\chat-icono.png"
        onClick={handleChatIconClick}
        style={{ position: 'absolute', top: '10px', right: '10px', width: '40px', height: '40px', cursor: 'pointer', zIndex: '1000' }}
      />
      {showChat && (
        <div className="chat-container" style={{ position: 'absolute', bottom: '10px', right: '10px', width: '300px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '10px', borderRadius: '5px', zIndex: '1000' }}>
          <div className="chat-messages" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
            {chatMessages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.playerName}: </strong>{msg.message}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} style={{ display: 'flex' }}>
            <input
              type="text"
              value={chatInput}
              onChange={handleChatInput}
              style={{ flex: '1', marginRight: '5px', padding: '5px' }}
            />
            <button type="submit" style={{ padding: '5px' }}>Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default GameCanvas;
