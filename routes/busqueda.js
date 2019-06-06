// importaciones
const express = require('express');

// declaración de variables
const app = express();

// modelos
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

// ==================================================================
// GET búsqueda universal COMIENZO
// PÚBLICO
// ==================================================================
app.get('/todos/:parametro', (req, res) => {
  const parametro = req.params.parametro;
  const regEx = new RegExp(parametro, 'i');

  Promise.all([
    buscarHospitales(regEx),
    buscarMedicos(regEx),
    buscarUsuarios(regEx)
  ]).then(respuesta => {
    res.status(200).json({
      ok: true,
      hospitales: respuesta[0],
      medicos: respuesta[1],
      usuarios: respuesta[2]
    });
  });
});
// ==================================================================
// búsqueda universal FINAL
// ==================================================================

// ==================================================================
// fúnciones de busqueda COMIENZO
// ==================================================================
function buscarHospitales(regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .exec((err, hospitales) => {
        if (err) {
          reject('Error al cargar hospitales');
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedicos(regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate('usuario', 'nombre email')
      .populate('hospital')
      .exec((err, medicos) => {
        if (err) {
          reject('Error al cargar medicos');
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuarios(regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, 'nombre email role')
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject('Error al cargar usuarios', err);
        } else {
          resolve(usuarios);
        }
      });
  });
}
// ==================================================================
// fúnciones de busqueda FINAL
// ==================================================================

module.exports = app;
