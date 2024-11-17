import bulletImageSrc from '../../assets/images/balas/Bala1Dp.png'; // Ajustar la ruta relativa

class BulletManager {
  constructor() {
    this.bullets = []; // Array para almacenar las balas
    this.bulletImage = new Image(); // Crear la instancia de la imagen
    this.bulletImage.src = bulletImageSrc; // Usar la imagen importada como fuente
  }

  shoot(playerX, playerY, direction, playerWidth = 100, playerHeight = 90) {
    const bulletSpeed = 4;
  
    // Normalizar la dirección para garantizar consistencia en velocidad
    const normalizedDirection = { ...direction };
    const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    if (magnitude > 0) {
      normalizedDirection.x /= magnitude;
      normalizedDirection.y /= magnitude;
    }
  
    // Calcular las coordenadas iniciales de la bala
    const initialX = playerX + playerWidth / 2;
    const initialY = playerY + playerHeight / 2;
  
    this.bullets.push({
      x: initialX,
      y: initialY,
      dx: normalizedDirection.x * bulletSpeed,
      dy: normalizedDirection.y * bulletSpeed,
    });
  }

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

  drawBullets(ctx, viewOffset) {
    // Verificar que la imagen esté completamente cargada antes de dibujar
    if (!this.bulletImage.complete || this.bulletImage.naturalWidth === 0) {
      console.warn('La imagen aún no se ha cargado. No se dibujarán balas.');
      return;
    }

    this.bullets.forEach((bullet) => {
      ctx.drawImage(
        this.bulletImage, // Imagen de la bala
        bullet.x - viewOffset.x - 10, // Ajusta las coordenadas para centrar
        bullet.y - viewOffset.y - 10,
        20, // Ancho de la bala
        20  // Alto de la bala
      );
    });
  }
}

export default BulletManager;
