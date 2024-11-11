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
  }

  getCurrentImage() {
    if (this.direction.y === -1) return images.up;
    if (this.direction.y === 1) return images.down;
    if (this.direction.x === -1) return images.left;
    if (this.direction.x === 1) return images.right;
    return images.down;
  }

  move(direction) {
    const moveSpeed = 5;
    switch (direction) {
      case 'ArrowUp':
        this.y -= moveSpeed;
        this.direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        this.y += moveSpeed;
        this.direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        this.x -= moveSpeed;
        this.direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        this.x += moveSpeed;
        this.direction = { x: 1, y: 0 };
        break;
      default:
        break;
    }
  }
}

export default Player;
