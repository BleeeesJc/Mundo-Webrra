import React, { useEffect, useRef } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';
import Tiles from './Tiles';
import MapImage from './FloresBlancas1.png';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const player = new Player();
  const bulletManager = new BulletManager();
  const tiles = new Tiles(MapImage); 
  let shootingInterval = null;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(); 
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the tiled background
      tiles.draw(ctx, canvas.width, canvas.height, player.x, player.y);

      // Draw the player in the center of the canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw bullets
      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });
    };

    const handleKeyDown = (e) => {
      player.move(e.key);
      draw();

      if ((player.direction.x !== 0 || player.direction.y !== 0) && !shootingInterval) {
        shootingInterval = setInterval(() => {
          bulletManager.shoot(player.x + canvas.width / 2, player.y + canvas.height / 2, player.direction);
          draw();
        }, 500); // Shoot every 500ms
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      if (shootingInterval) clearInterval(shootingInterval);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default GameCanvas;
