class Player {
    constructor() {
      this.x = 0; // Coordenadas iniciales del "mundo"
      this.y = 0;
      this.direction = { x: 0, y: 0 }; // Dirección actual del movimiento
    }
  
    move(direction) {
      const moveSpeed = 5; // Velocidad de movimiento
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
  