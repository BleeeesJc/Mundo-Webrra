import React, { useEffect } from "react";
import "../../styles/GameOver.css";
import gameOverImage from "../../assets/images/gameover.png";
import gameOverSound from "../../sounds/gameOver.mp3";

const GameOver = () => {
  useEffect(() => {
    const audio = new Audio(gameOverSound);
    audio.volume = 0.8; // Ajusta el volumen si lo deseas
    audio.play();
  }, []);

  return (
    <div className="game-over-container">
      <img src={gameOverImage} alt="Game Over" className="game-over-image" />
    </div>
  );
};

export default GameOver;