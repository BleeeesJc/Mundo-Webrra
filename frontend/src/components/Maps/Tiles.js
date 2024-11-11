// Tiles.js
import FloresBlancas1 from './FloresBlancas1.png';
import FloresRojas1 from './FloresRojas1.png';
import FlorMorada1 from './FlorMorada1.png';

class Tiles {
  constructor() {
    this.tileImages = {
      blancas: FloresBlancas1,
      rojas: FloresRojas1,
      moradas: FlorMorada1,
    };

    this.mapMatrix = [
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
      ['rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas'],
      ['blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas'],
      ['moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas', 'moradas', 'blancas', 'rojas'],
    ];

    this.tiles = Object.keys(this.tileImages).reduce((acc, type) => {
      const img = new Image();
      img.src = this.tileImages[type];
      img.isLoaded = false;
      img.onload = () => (img.isLoaded = true);
      acc[type] = img;
      return acc;
    }, {});
  }

  draw(ctx, playerX, playerY, canvasWidth, canvasHeight) {
    const tileWidth = 256;
    const tileHeight = 256;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    for (let row = 0; row < this.mapMatrix.length; row++) {
      for (let col = 0; col < this.mapMatrix[row].length; col++) {
        const tileType = this.mapMatrix[row][col];
        const tile = this.tiles[tileType];

        if (tile && tile.isLoaded) {
          const x = centerX + (col * tileWidth - playerX);
          const y = centerY + (row * tileHeight - playerY);

          if (x > -tileWidth && x < canvasWidth && y > -tileHeight && y < canvasHeight) {
            ctx.drawImage(tile, x, y, tileWidth, tileHeight);
          }
        }
      }
    }
  }
}

export default Tiles;
