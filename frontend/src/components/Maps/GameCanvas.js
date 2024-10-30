import React, { useEffect, useRef } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const player = new Player();
  const bulletManager = new BulletManager();
  let shootingInterval = null;

  useEffect(() => {
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

      // Dibujar el punto en el centro del canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Dibujar las balas
      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });

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

      // Iniciar el disparo continuo si hay una dirección de movimiento y aún no se está disparando
      if ((player.direction.x !== 0 || player.direction.y !== 0) && !shootingInterval) {
        shootingInterval = setInterval(() => {
          bulletManager.shoot(player.x + canvas.width / 2, player.y + canvas.height / 2, player.direction);
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
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ display: 'block' }} />
  );
};

export default GameCanvas;
