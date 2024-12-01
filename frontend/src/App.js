import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import GameView from './views/GameView';
import MenuPer from './views/MenuPer';
import MenuMap from './views/MenuMap';
import GameOver from './components/Game/Gameover'; // Importar el componente GameOver

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameView />} />
        <Route path="/menu" element={<MenuPer />} />
        <Route path="/menuM" element={<MenuMap />} />
        <Route path="/gameover" element={<GameOver />} /> {/* Ruta para Game Over */}
      </Routes>
    </Router>
  );
}

export default App;
