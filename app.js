// importaciones
const express = require('express');
const mongoose = require('mongoose');

// inicializar variables
const app = express();
const PORT = process.env.PORT || 3000;

// conectar con MongoDB
mongoose.connect('mongodb://localhost:27017/hospital', (err, res) => {
  if (err) throw err;

  console.log(`Base de datos: \x1b[32m%s\x1b[0m`, 'online');
});

// rutas
app.get('/', (req, res, next) => {
  res.status(200).json({
    miMensaje: '¡Todo salío de maravilla!'
  });
});

// escuchar peticiones
app.listen(PORT, () => {
  console.log(
    `Express server corriendo en puerto ${PORT}: \x1b[32m%s\x1b[0m`,
    'online'
  );
});
