// importaciones
const express = require('express');

// inicializar variables
const app = express();

// rutas
app.get('/', (req, res) => {
  res.status(200).json({
    miMensaje: '¡Todo salío de maravilla!'
  });
});

module.exports = app;
