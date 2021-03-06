// importaciones
const express = require('express');

// declaración de variables
const app = express();
const COLECCIONES = require('../config/config').COLECCIONES;
// modelos
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

// ==================================================================
// GET búsqueda dinámica COMIENZO
// PÚBLICO
// ==================================================================
app.get('/:variante/:parametro', (req, res) => {
  const VARIANTES_VALIDAS = ['todo', ...COLECCIONES];
  const variante = req.params.variante;
  if (!VARIANTES_VALIDAS.includes(variante)) {
    return res.status(500).json({
      ok: false,
      mensaje: `Parámetro "${variante}" inválido. Válidos ${VARIANTES_VALIDAS.join(
        ', '
      )}`
    });
  }

  const parametro = req.params.parametro;
  const regex = new RegExp(parametro, 'i');
  let promesa;

  switch (variante) {
    case 'todo':
      promesa = Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
      ]);
      break;
    // medico
    case COLECCIONES[0]:
      promesa = buscarMedicos(regex);
      break;
    // usuario
    case COLECCIONES[2]:
      promesa = buscarUsuarios(regex);
      break;
    // hospital
    case COLECCIONES[1]:
      promesa = buscarHospitales(regex);
      break;
  }

  if (promesa && variante !== 'todo') {
    promesa.then(data => {
      return res.status(200).json({
        ok: true,
        [variante]: data
      });
    });
  } else {
    promesa.then(respuesta => {
      return res.status(200).json({
        ok: true,
        hospitales: respuesta[0],
        medicos: respuesta[1],
        usuarios: respuesta[2]
      });
    });
  }
});
// ==================================================================
// búsqueda dinámica FINAL
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
    Usuario.find({}, 'nombre email role img isGoogle')
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
