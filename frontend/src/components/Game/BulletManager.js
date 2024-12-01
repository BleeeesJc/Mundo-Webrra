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
  
    // Normalizar la dirección para garantizar consistencia en velocidad
    const magnitude = Math.sqrt(rawDirection.x ** 2 + rawDirection.y ** 2);
    const normalizedDirection = { 
      x: rawDirection.x / magnitude || 0, 
      y: rawDirection.y / magnitude || 0 
    };
  
    // Validar dirección
    if (normalizedDirection.x === 0 && normalizedDirection.y === 0) {
      console.warn('Dirección inválida para disparar.');
      return;
    }
  
    // Determinar la clave de dirección utilizando rawDirection
    const directionKey = this.getDirectionKey(rawDirection);

    // Calcular las coordenadas iniciales de la bala
    const initialX = playerX + playerWidth / 2;
    const initialY = playerY + playerHeight / 2;

    // Agregar la nueva bala
    const bulletSize = 10; // Tamaño de la hitbox de la bala
    this.bullets.push({
      x: initialX,
      y: initialY,
      dx: normalizedDirection.x * bulletSpeed,
      dy: normalizedDirection.y * bulletSpeed,
      image: this.bulletImages[directionKey],
      hitbox: {
        x: initialX - bulletSize / 2,
        y: initialY - bulletSize / 2,
        width: bulletSize,
        height: bulletSize,
      },
    });
  }

  // Determinar la clave de dirección
  getDirectionKey(direction) {
    // Redondear los valores de x e y
    const x = Math.round(direction.x);
    const y = Math.round(direction.y);
  
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
  
    return 'down'; // Dirección por defecto
  }

  updateBullets(viewOffset, canvasWidth, canvasHeight) {
    const bulletSize = 10; // Tamaño de la hitbox de la bala
    this.bullets.forEach((bullet, index) => {
      // Actualizar posición de la bala
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;

      // Actualizar posición de la hitbox
      bullet.hitbox.x = bullet.x - bulletSize / 2;
      bullet.hitbox.y = bullet.y - bulletSize / 2;

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

      // Dibujar hitbox de la bala
      ctx.strokeStyle = 'blue';
      ctx.strokeRect(
        bullet.hitbox.x - viewOffset.x,
        bullet.hitbox.y - viewOffset.y,
        bullet.hitbox.width,
        bullet.hitbox.height
      );
    });
  }
}

export default BulletManager;
