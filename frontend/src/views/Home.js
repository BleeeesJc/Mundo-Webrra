import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import AMT from '../assets/images/AMT.png';
import PIST from '../assets/images/PIST.png';
import ESP from '../assets/images/ESP.png';
import ESPF from '../assets/images/ESPF.png';
import MSHOME from '../sounds/MSHOME.mp3'; 
import '../styles/pixel.css'; // El archivo con la tipografía en píxeles

const Home = () => {
  const [audioPlayed, setAudioPlayed] = useState(false);

  const playSound = () => {
    const audio = new Audio(MSHOME);  // Crea un objeto Audio con el archivo importado
    audio.play();
    setAudioPlayed(true);  // Marca que el sonido se ha reproducido
  };

  useEffect(() => {
    // Solo se reproducirá si el sonido no se ha jugado aún
    if (!audioPlayed) {
      window.addEventListener("click", playSound, { once: true }); // Reproduce el sonido cuando se hace clic
    }

    return () => {
      window.removeEventListener("click", playSound); // Limpia el evento
    };
  }, [audioPlayed]);

  useEffect(() => {
    // Código de animación de partículas y otras animaciones
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

    const c = document.getElementById("canvas-club");
    const ctx = c.getContext("2d");
    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;
    const maxParticles = 60;
    const particles = [];
    let hue = 183;
    let colorPaused = false;

    const mouse = {
      x: null,
      y: null,
      touches: function (e) {
        const touches = e.touches;
        if (touches) {
          mouse.x = touches[0].clientX;
          mouse.y = touches[0].clientY;
        } else {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        }
        e.preventDefault();
      },
    };

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function P() {}

    P.prototype = {
      init: function () {
        this.x = mouse.x || w / 2;
        this.y = mouse.y || h / 2;
        this.size = random(5, 30);
        this.vx = random(-3, 3);
        this.vy = random(-5, 5);
        this.life = 0;
        this.maxLife = random(50, 150);
      },

      draw: function () {
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, .8)`;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, .5)`;
        ctx.lineWidth = this.size / 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.update();
      },

      update: function () {
        if (this.life > this.maxLife || this.size < 0.1) {
          this.init();
        } else {
          if (this.y + this.size >= h || this.y - this.size <= 0) {
            this.vy *= -1;
          }
          if (this.x + this.size >= w || this.x - this.size <= 0) {
            this.vx *= -1;
          }
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= 0.99;
          this.size *= 0.99;
          this.life++;
        }
      },
    };

    window.addEventListener("mousemove", mouse.touches);
    window.addEventListener("touchstart", mouse.touches);
    window.addEventListener("touchmove", mouse.touches);

    window.addEventListener("mouseout", function () {
      mouse.x = mouse.y = null;
    });

    window.addEventListener("resize", function () {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    });

    c.addEventListener("click", function () {
      colorPaused = colorPaused ? false : true;
    });

    function setup() {
      for (let i = 0; i < maxParticles; i++) {
        setTimeout(function () {
          const p = new P();
          p.init();
          particles.push(p);
        }, i * 20);
      }
    }

    function anim() {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.fillRect(0, 0, w, h);

      for (let i in particles) {
        particles[i].draw();
      }

      if (!colorPaused) {
        hue += 0.5;
      }

      window.requestAnimationFrame(anim);
    }

    setup();
    anim();

    // Código para agregar imágenes que caen
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = '100%';
    container.style.height = '100%';
    document.body.appendChild(container);

    const imageSources = [
      AMT,
      PIST,
      ESP,
      ESPF
    ];

    function createFallingImage() {
      const img = document.createElement('img');
      img.src = imageSources[Math.floor(Math.random() * imageSources.length)];
      img.classList.add('falling-image');
      img.style.width = '64px';
      img.style.height = '80px';

      // Start at a random horizontal position
      img.style.left = `${Math.random() * 100}vw`;

      container.appendChild(img);

      // Animate the image with CSS
      img.animate([{
          transform: 'translateX(0) translateY(0)',
          offset: 0
        },
        {
          transform: 'translateX(50px) translateY(200px)',
          offset: 0.25
        },
        {
          transform: 'translateX(-50px) translateY(400px)',
          offset: 0.5
        },
        {
          transform: 'translateX(50px) translateY(600px)',
          offset: 0.75
        },
        {
          transform: 'translateX(0) translateY(800px)',
          offset: 1
        }
      ], {
        duration: 5000,
        easing: 'ease-in-out',
        iterations: 1
      }).onfinish = () => container.removeChild(img);
    }

    // Create a new falling image every second
    const interval = setInterval(createFallingImage, 1000);

    // Cleanup when component unmounts
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", mouse.touches);
      window.removeEventListener("touchstart", mouse.touches);
      window.removeEventListener("touchmove", mouse.touches);
      window.removeEventListener("mouseout", function () {
        mouse.x = mouse.y = null;
      });
      window.removeEventListener("resize", function () {
        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;
      });
      c.removeEventListener("click", function () {
        colorPaused = colorPaused ? false : true;
      });
      document.body.removeChild(container);
    };
  }, [audioPlayed]);

  return (
    <div className="home-container">
      <div className="image-background"></div>
      <Link to="/game">
        <button className="start-button"></button>
      </Link>
      <canvas id="canvas-club"></canvas>
      <div className="blinking-text">PRESS START</div>
    </div>
  );
};

export default Home;
