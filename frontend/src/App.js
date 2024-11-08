import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import GameView from './views/GameView';
import MenuPer from './views/MenuPer';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameView />} />
        <Route path="/menu" element={<MenuPer />} /> {/* Nueva ruta */}

      </Routes>
    </Router>
  );
}

export default App;
