
class Tiles {
    constructor(tileImages) {
      this.tiles = tileImages.map(src => {
        const img = new Image();
        img.src = src;
        img.isLoaded = false;
        img.onload = () => (img.isLoaded = true);
        return img;
      });
    }
  
    draw(ctx, canvasWidth, canvasHeight, offsetX, offsetY, mapMatrix) {
      const tileWidth = this.tiles[0].width;
      const tileHeight = this.tiles[0].height;
  
      for (let row = 0; row < mapMatrix.length; row++) {
        for (let col = 0; col < mapMatrix[row].length; col++) {
          const tileIndex = mapMatrix[row][col];
          const tile = this.tiles[tileIndex];
  
          if (tile && tile.isLoaded) {
            const x = col * tileWidth - offsetX % tileWidth;
            const y = row * tileHeight - offsetY % tileHeight;
            ctx.drawImage(tile, x, y);
          }
        }
      }
    }
  }
  
  export default Tiles;
  