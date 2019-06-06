// importaciones
const express = require('express');

// declaración de variables
const app = express();

// modelos
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

// ==================================================================
// GET búsqueda dinámica COMIENZO
// PÚBLICO
// ==================================================================
app.get('/:variante/:parametro', (req, res) => {
  const VARIANTES_VALIDAS = ['todo', 'medicos', 'hospitales', 'usuarios'];
  const variante = req.params.variante;
  if (!VARIANTES_VALIDAS.includes(variante)) {
    return res.status(500).json({
      ok: false,
      mensaje: `Parámetro "${variante}" inválido`
    });
  }

  const parametro = req.params.parametro;
  const regEx = new RegExp(parametro, 'i');
  let promesa;

  switch (variante) {
    case 'todo':
      promesa = Promise.all([
        buscarHospitales(regEx),
        buscarMedicos(regEx),
        buscarUsuarios(regEx)
      ]);
      break;
    case 'medicos':
      promesa = buscarMedicos(regEx);
      break;
    case 'usuarios':
      promesa = buscarUsuarios(regEx);
      break;
    case 'hospitales':
      promesa = buscarHospitales(regEx);
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
