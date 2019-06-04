// importaciones
const express = require('express');

// inicializar variables
const app = express();
const PORT = process.env.PORT || 3000;

//
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
