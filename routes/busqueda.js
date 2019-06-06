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
app.get('/:variante/:parametro', (req, res) => {
  const VARIANTES_VALIDAS = ['todo', 'medico', 'hospital', 'usuario'];
  const variante = req.params.variante;
  if (!VARIANTES_VALIDAS.includes(variante)) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Parámetro inválido'
    });
  }

  const parametro = req.params.parametro;
  const regEx = new RegExp(parametro, 'i');

  switch (variante) {
    case 'todo':
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
      break;
    case 'medico':
      buscarMedicos(regEx).then(medicos => {
        res.status(200).json({
          ok: true,
          medicos
        });
      });
      break;
    case 'usuario':
      buscarUsuarios(regEx).then(usuarios => {
        res.status(200).json({
          ok: true,
          usuarios
        });
      });
      break;
    case 'hospital':
      buscarHospitales(regEx).then(hospitales => {
        res.status(200).json({
          ok: true,
          hospitales
        });
      });
      break;
  }
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
