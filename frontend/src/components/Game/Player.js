import upImageSrc from '../../assets/images/characters/DpFinalSolopngArriba.png';
import downImageSrc from '../../assets/images/characters/DpFinalSolopngAbajo.png';
import leftImageSrc from '../../assets/images/characters/DpFinalSolopngIzquierda.png';
import rightImageSrc from '../../assets/images/characters/DpFinalSolopngDerecha.png';

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
class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.direction = { x: 0, y: 0 };
    this.rawDirection = { x: 0, y: 0 };
    this.mapSizeInPixels = 45 * 256;
    this.tileSize = 256;

    // Dimensiones del hitbox y del jugador
    this.hitboxWidth = 50;
    this.hitboxHeight = 85;
    this.width = 100; // Ancho del sprite
    this.height = 90; // Alto del sprite
  }

  setRawDirection(rawDirection) {
    this.rawDirection = rawDirection;
  }

  getCurrentImage() {
    const { x, y } = this.rawDirection;

    if (y === -1 && x === 0) return images.up;
    if (y === 1 && x === 0) return images.down;
    if (x === -1 && y === 0) return images.left;
    if (x === 1 && y === 0) return images.right;

    return images.down;
  }

  move(direction) {
    const moveSpeed = 5;
    const { x, y } = direction;

    this.x = Math.min(Math.max(0, this.x + x * moveSpeed), this.mapSizeInPixels - this.tileSize);
    this.y = Math.min(Math.max(0, this.y + y * moveSpeed), this.mapSizeInPixels - this.tileSize);

    this.direction = direction;
  }

  getHitbox() {
    return {
      x: this.x - this.hitboxWidth / 2,
      y: this.y - this.hitboxHeight / 2,
      width: this.hitboxWidth,
      height: this.hitboxHeight,
    };
  }
}

export default Player;
