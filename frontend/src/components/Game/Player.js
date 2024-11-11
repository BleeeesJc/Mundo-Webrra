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
        this.y -= moveSpeed;
        this.direction = { x: 0, y: -1 }; // Mira hacia arriba
        break;
      case 'ArrowDown':
        this.y += moveSpeed;
        this.direction = { x: 0, y: 1 }; // Mira hacia abajo
        break;
      case 'ArrowLeft':
        this.x -= moveSpeed;
        this.direction = { x: -1, y: 0 }; // Mira hacia la izquierda
        break;
      case 'ArrowRight':
        this.x += moveSpeed;
        this.direction = { x: 1, y: 0 }; // Mira hacia la derecha
        break;
      default:
        break;
    }
  }
}

export default Player;
