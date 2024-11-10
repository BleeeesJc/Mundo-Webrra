class Tiles {
    constructor(imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
      this.isLoaded = false;
  
      this.image.onload = () => {
        this.isLoaded = true;
      };
    }
  
    draw(ctx, canvasWidth, canvasHeight, offsetX, offsetY) {
      if (!this.isLoaded) return;
  
      const tileWidth = this.image.width;
      const tileHeight = this.image.height;
  
      for (let x = -tileWidth + (offsetX % tileWidth); x < canvasWidth; x += tileWidth) {
        for (let y = -tileHeight + (offsetY % tileHeight); y < canvasHeight; y += tileHeight) {
          ctx.drawImage(this.image, x, y);
        }
      }
    }
  }
  
  export default Tiles;