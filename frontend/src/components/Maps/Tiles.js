// Tiles.js
import FloresBlancas1 from './FloresBlancas1.png';
import FloresRojas1 from './FloresRojas1.png';
import FlorMorada1 from './FlorMorada1.png';

class Tiles {
  constructor() {
    // Inicialización del mapa y las imágenes
    this.tileImages = {
      blancas: FloresBlancas1,
      rojas: FloresRojas1,
      moradas: FlorMorada1,
    };

    this.mapMatrix = Array(45).fill().map((_, rowIndex) =>
      Array(45).fill().map((_, colIndex) => {
        const blockPattern = [
          ['blancas', 'rojas', 'moradas'],
          ['moradas', 'blancas', 'rojas'],
          ['rojas', 'moradas', 'blancas']
        ];
        return blockPattern[rowIndex % 3][colIndex % 3];
      })
    );

    this.tiles = Object.keys(this.tileImages).reduce((acc, type) => {
      const img = new Image();
      img.src = this.tileImages[type];
      img.isLoaded = false;
      img.onload = () => (img.isLoaded = true);
      acc[type] = img;
      return acc;
    }, {});

    this.mapSize = 45; // Tamaño de la matriz del mapa (45x45)
  }

  // Nuevo método para limitar la posición del jugador
  constrainPlayerPosition(playerX, playerY) {
    const maxPosition = this.mapSize * 256 - 256; // Tamaño máximo en píxeles según la matriz de 45x45 y el tamaño de los tiles

    // Restringir el valor de playerX y playerY
    const constrainedX = Math.max(0, Math.min(playerX, maxPosition));
    const constrainedY = Math.max(0, Math.min(playerY, maxPosition));

    return { x: constrainedX, y: constrainedY };
  }

  draw(ctx, playerX, playerY, canvasWidth, canvasHeight) {
    const tileWidth = 256;
    const tileHeight = 256;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Llamar a constrainPlayerPosition para ajustar las coordenadas del jugador
    const { x: constrainedPlayerX, y: constrainedPlayerY } = this.constrainPlayerPosition(playerX, playerY);

    for (let row = 0; row < this.mapMatrix.length; row++) {
      for (let col = 0; col < this.mapMatrix[row].length; col++) {
        const tileType = this.mapMatrix[row][col];
        const tile = this.tiles[tileType];

        if (tile && tile.isLoaded) {
          const x = centerX + (col * tileWidth - constrainedPlayerX);
          const y = centerY + (row * tileHeight - constrainedPlayerY);

          if (x > -tileWidth && x < canvasWidth && y > -tileHeight && y < canvasHeight) {
            ctx.drawImage(tile, x, y, tileWidth, tileHeight);
          }
        }
      }
    }
  }
}

export default Tiles;
