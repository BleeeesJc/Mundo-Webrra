import React, { useEffect, useRef } from 'react';
import Player from '../Game/Player';
import BulletManager from '../Game/BulletManager';
import Tiles from './Tiles';
import TileImage1 from './FloresBlancas1.png';
import TileImage2 from './FloresRojas1.png';
import TileImage3 from './FlorMorada1.png';

const TILE_SIZE = 128; 
const VISIBLE_TILES_X = 32; 
const VISIBLE_TILES_Y = 32; 


const getTileType = (tileX, tileY, numTiles) => {
  const pseudoRandomNumber = Math.abs((tileX * 73856093) ^ (tileY * 19349663)) % numTiles;
  return pseudoRandomNumber;
};

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const player = new Player();
  const bulletManager = new BulletManager();
  const tiles = new Tiles([TileImage1, TileImage2, TileImage3]); 

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


      const startTileX = Math.floor(player.x / TILE_SIZE) - Math.floor(VISIBLE_TILES_X / 2);
      const startTileY = Math.floor(player.y / TILE_SIZE) - Math.floor(VISIBLE_TILES_Y / 2);

      for (let row = 0; row < VISIBLE_TILES_Y; row++) {
        for (let col = 0; col < VISIBLE_TILES_X; col++) {
          const tileX = startTileX + col;
          const tileY = startTileY + row;

          const tileType = getTileType(tileX, tileY, tiles.tiles.length);
          const tile = tiles.tiles[tileType];

          if (tile && tile.isLoaded) {
            const x = (tileX * TILE_SIZE) - player.x % TILE_SIZE + canvas.width / 2;
            const y = (tileY * TILE_SIZE) - player.y % TILE_SIZE + canvas.height / 2;
            ctx.drawImage(tile, x, y);
          }
        }
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();

      bulletManager.drawBullets(ctx, { x: player.x, y: player.y });
    };

    const handleKeyDown = (e) => {
      player.move(e.key);
      draw();

      if ((player.direction.x !== 0 || player.direction.y !== 0) && !shootingInterval) {
        shootingInterval = setInterval(() => {
          bulletManager.shoot(player.x + canvas.width / 2, player.y + canvas.height / 2, player.direction);
          draw();
        }, 500);
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
