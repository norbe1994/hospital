// importaciones
const express = require('express');
const path = require('path');
const fs = require('fs');

// declaración de variables
const app = express();

// ==================================================================
// GET imagen COMIENZO
// PÚBLICO
// ==================================================================
app.get('/:coleccion/:img', (req, res) => {
  const { coleccion, img } = req.params;

  let pathImagen = path.resolve(__dirname, `../uploads/${coleccion}/${img}`);

  if (fs.existsSync(pathImagen)) {
    return res.sendFile(pathImagen);
  } else {
    pathImagen = path.resolve(__dirname, '../assets/no-image.jpeg');
    return res.sendFile(pathImagen);
  }
});
// ==================================================================
// imagen FINAL
// ==================================================================

module.exports = app;
