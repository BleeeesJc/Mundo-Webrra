import bulletUpImageSrc from '../../assets/images/balas/Bala1ArribaDp.png';
import bulletDownImageSrc from '../../assets/images/balas/Bala1AbajoDp.png';
import bulletLeftImageSrc from '../../assets/images/balas/Bala1IzqDp.png';
import bulletRightImageSrc from '../../assets/images/balas/Bala1DerDp.png';
import bulletUpLeftImageSrc from '../../assets/images/balas/Bala1ArrIzqDp.png';
import bulletUpRightImageSrc from '../../assets/images/balas/Bala1ArrDerDp.png';
import bulletDownLeftImageSrc from '../../assets/images/balas/Bala1AbajoIzqDp.png';
import bulletDownRightImageSrc from '../../assets/images/balas/Bala1AbajoDerDp.png';

class BulletManager {
  constructor() {
    this.bullets = []; // Array para almacenar las balas

    // Mapeo de imágenes de balas según la dirección
    this.bulletImages = {
      up: bulletUpImageSrc,
      down: bulletDownImageSrc,
      left: bulletLeftImageSrc,
      right: bulletRightImageSrc,
      upLeft: bulletUpLeftImageSrc,
      upRight: bulletUpRightImageSrc,
      downLeft: bulletDownLeftImageSrc,
      downRight: bulletDownRightImageSrc,
    };
  }

  // Método para disparar una bala
  shoot(playerX, playerY, rawDirection, playerWidth = 100, playerHeight = 90) {
    const bulletSpeed = 4;
  
    // Normalizar la dirección
    const magnitude = Math.sqrt(rawDirection.x ** 2 + rawDirection.y ** 2);
    const normalizedDirection = magnitude > 0 ? 
      { x: rawDirection.x / magnitude, y: rawDirection.y / magnitude } : 
      { x: 0, y: 0 };
  
    // Validar dirección
    if (normalizedDirection.x === 0 && normalizedDirection.y === 0) {
      console.warn('Dirección inválida para disparar.');
      return;
    }
  
    // Determinar la clave de dirección
    const directionKey = this.getDirectionKey(rawDirection);
  
    // Calcular las coordenadas iniciales de la bala
    const initialX = playerX + playerWidth / 2;
    const initialY = playerY + playerHeight / 2;
  
    // Agregar la nueva bala
    this.bullets.push({
      x: initialX,
      y: initialY,
      dx: normalizedDirection.x * bulletSpeed,
      dy: normalizedDirection.y * bulletSpeed,
      image: this.bulletImages[directionKey],
    });
  }
  

  // Determinar la clave de dirección
  getDirectionKey(direction) {
    const { x, y } = direction;

    // Verificar las combinaciones diagonales primero
    if (x === -1 && y === -1) return 'upLeft';
    if (x === 1 && y === -1) return 'upRight';
    if (x === -1 && y === 1) return 'downLeft';
    if (x === 1 && y === 1) return 'downRight';

    // Direcciones principales
    if (x === 0 && y === -1) return 'up';
    if (x === 0 && y === 1) return 'down';
    if (x === -1 && y === 0) return 'left';
    if (x === 1 && y === 0) return 'right';

    return 'down'; // Dirección por defecto (seguridad)
  }

  // Actualizar las balas en movimiento
  updateBullets(viewOffset, canvasWidth, canvasHeight) {
    this.bullets.forEach((bullet, index) => {
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;

      // Remover balas que salen del canvas
      if (
        bullet.x < viewOffset.x ||
        bullet.x > viewOffset.x + canvasWidth ||
        bullet.y < viewOffset.y ||
        bullet.y > viewOffset.y + canvasHeight
      ) {
        this.bullets.splice(index, 1);
      }
    });
  }

  // Dibujar las balas en el canvas
  drawBullets(ctx, viewOffset) {
    this.bullets.forEach((bullet) => {
      const bulletImage = new Image();
      bulletImage.src = bullet.image;

      ctx.drawImage(
        bulletImage,
        bullet.x - viewOffset.x - 10, // Ajusta las coordenadas para centrar
        bullet.y - viewOffset.y - 10,
        20, // Ancho de la bala
        20  // Alto de la bala
      );
    });
  }
}

export default BulletManager;
