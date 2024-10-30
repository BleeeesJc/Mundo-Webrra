import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido al Juego</h1>
      <Link to="/game">
        <button>Empezar Juego</button>
      </Link>
    </div>
  );
};

export default Home;
