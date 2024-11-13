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
    this.direction = { x: 0, y: 0 }; // Dirección inicial
    this.mapSizeInPixels = 45 * 256; // Tamaño del mapa en píxeles
    this.tileSize = 256; // Tamaño de cada tile en píxeles
  }

  getCurrentImage() {
    // Verifica la dirección y retorna la imagen correspondiente
    if (this.direction.y === -1) return images.up; // Mira hacia arriba
    if (this.direction.y === 1) return images.down; // Mira hacia abajo
    if (this.direction.x === -1) return images.left; // Mira hacia la izquierda
    if (this.direction.x === 1) return images.right; // Mira hacia la derecha
    return images.down; // Por defecto, hacia abajo
  }

  move(direction) {
    const moveSpeed = 5;

    // Actualiza la dirección dependiendo de la tecla presionada
    switch (direction) {
      case 'ArrowUp':
        this.y = Math.max(0, this.y - moveSpeed);
        this.direction = { x: 0, y: -1 }; // Mira hacia arriba
        break;
      case 'ArrowDown':
        this.y = Math.min(this.mapSizeInPixels - this.tileSize, this.y + moveSpeed);
        this.direction = { x: 0, y: 1 }; // Mira hacia abajo
        break;
      case 'ArrowLeft':
        this.x = Math.max(0, this.x - moveSpeed);
        this.direction = { x: -1, y: 0 }; // Mira hacia la izquierda
        break;
      case 'ArrowRight':
        this.x = Math.min(this.mapSizeInPixels - this.tileSize, this.x + moveSpeed);
        this.direction = { x: 1, y: 0 }; // Mira hacia la derecha
        break;
      default:
        break;
    }
  }
}

export default Player;
