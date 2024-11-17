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
    this.direction = { x: 0, y: 0 }; // Normalizada para movimiento
    this.rawDirection = { x: 0, y: 0 }; // Sin normalizar para imágenes
    this.mapSizeInPixels = 45 * 256;
    this.tileSize = 256;
  }

  setRawDirection(rawDirection) {
    this.rawDirection = rawDirection;
  }

  getCurrentImage() {
    // Usar rawDirection para determinar la imagen
    const { x, y } = this.rawDirection;

    if (y === -1 && x === 0) return images.up;
    if (y === 1 && x === 0) return images.down;
    if (x === -1 && y === 0) return images.left;
    if (x === 1 && y === 0) return images.right;

    // Para movimientos diagonales
    if (x === -1 && y === -1) return images.left; // Arriba-Izquierda
    if (x === 1 && y === -1) return images.right; // Arriba-Derecha
    if (x === -1 && y === 1) return images.left; // Abajo-Izquierda
    if (x === 1 && y === 1) return images.right; // Abajo-Derecha

    return images.down;
  }

  move(direction) {
    const moveSpeed = 5;
    const { x, y } = direction;

    // Calcular nueva posición
    this.x = Math.min(Math.max(0, this.x + x * moveSpeed), this.mapSizeInPixels - this.tileSize);
    this.y = Math.min(Math.max(0, this.y + y * moveSpeed), this.mapSizeInPixels - this.tileSize);

    // Actualizar dirección normalizada
    this.direction = direction;
  }
}

export default Player;
