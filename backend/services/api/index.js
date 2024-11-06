const express = require('express');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const server = http.createServer(app);

// Configuración de CORS para permitir solicitudes desde el frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Proxy para el servicio de jugadores
app.use('/player-service', createProxyMiddleware({
  target: 'http://localhost:5001', // Dirección del player-service
  changeOrigin: true
}));

// Proxy para el servicio del juego
app.use('/game-service', createProxyMiddleware({
  target: 'http://localhost:5000', // Dirección del game-service
  changeOrigin: true
}));

// Ruta raíz para verificar el estado del API Gateway
app.get('/', (req, res) => {
  res.send('API Gateway está funcionando');
});

// Iniciar el servidor en el puerto 4000
server.listen(4000, () => {
  console.log('API Gateway está ejecutándose en el puerto 4000');
});
