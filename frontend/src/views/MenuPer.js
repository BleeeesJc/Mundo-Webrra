import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la redirección
import '../styles/MenuPer.css';
import '../styles/pixel.css';
import HAMILTON from '../assets/images/HAMILTON.png';
import GOYO from '../assets/images/GOYO.png';
import DP from '../assets/images/DP.png';
import AMT from '../assets/images/AMT.png';
import PIST from '../assets/images/PIST.png';
import ESP from '../assets/images/ESP.png';
import ESPF from '../assets/images/ESPF.png';
import CAMBIOS_SOUND from '../sounds/cambios.mp3'; // Importa el sonido

const MenuPer = () => {
  const navigate = useNavigate();
  const imageSources = [AMT, PIST, ESP, ESPF];

  useEffect(() => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    function createFallingImage() {
      const img = document.createElement('img');
      img.src = imageSources[Math.floor(Math.random() * imageSources.length)];
      img.classList.add('falling-image');
      img.style.width = '64px';
      img.style.height = '80px';
      img.style.position = 'absolute';
      img.style.left = `${Math.random() * 100}vw`;
      img.style.top = '-100px';

      container.appendChild(img);

      img.animate(
        [
          { transform: 'translateY(0px)' },
          { transform: `translateY(${window.innerHeight + 100}px)` },
        ],
        {
          duration: 5000 + Math.random() * 2000,
          easing: 'ease-in-out',
        }
      ).onfinish = () => container.removeChild(img);
    }

    const interval = setInterval(createFallingImage, 1000);

    return () => {
      clearInterval(interval);
      document.body.removeChild(container);
    };
  }, [imageSources]);

  const playSound = () => {
    const audio = new Audio(CAMBIOS_SOUND);
    audio.volume = 1;
    audio.play();
  };

  const handleDoubleClick = () => {
    navigate('/game');
  };

  return (
    <div className="menu-container">
      <div className="menu-text">Selecciona tu personaje!!</div>
      <div className="character-selection">
        <div
          className="character-card"
          onClick={playSound}
          onDoubleClick={handleDoubleClick}
        >
          <img src={HAMILTON} alt="Hamilton" className="character-image" />
          <div className="character-name">HAMILTON</div>
        </div>
        <div
          className="character-card"
          onClick={playSound}
          onDoubleClick={handleDoubleClick}
        >
          <img src={DP} alt="DP" className="character-image" />
          <div className="character-name">DPNEITOR</div>
        </div>
        <div
          className="character-card"
          onClick={playSound}
          onDoubleClick={handleDoubleClick}
        >
          <img src={GOYO} alt="GOYO" className="character-image" />
          <div className="character-name">GOYO</div>
        </div>
      </div>
    </div>
  );
};

export default MenuPer;
