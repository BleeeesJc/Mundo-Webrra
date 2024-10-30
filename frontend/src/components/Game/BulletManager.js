class BulletManager {
    constructor() {
      this.bullets = []; // Array para almacenar las balas
    }
  
    shoot(x, y, direction) {
      const bulletSpeed = 4;
      this.bullets.push({
        x,
        y,
        dx: direction.x * bulletSpeed,
        dy: direction.y * bulletSpeed,
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
      ctx.fillStyle = 'black';
      this.bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x - viewOffset.x, bullet.y - viewOffset.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
  
  export default BulletManager;
  