// importaciones
const express = require('express');

// inicializar variables
const app = express();

// importar modelo/s
const Usuario = require('../models/usuario');

// ==================================================================
// GET todos los usuarios COMIENZO
// privado(ADMIN)
// ==================================================================
app.get('/', (req, res, next) => {
  Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando usuarios',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      usuarios
    });
  });
});
// ==================================================================
// GET todos los usuarios FINAL
// ==================================================================

// ==================================================================
// POST crear usuario COMIENZO
// privado(ADMIN)
// ==================================================================
app.use('/', (req, res) => {
  const { nombre, email, password, img, role } = req.body;

  const usuario = new Usuario({
    nombre,
    email,
    password,
    img,
    role
  });

  usuario.save((err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

    return res.status(201).json({
      ok: true,
      usuario
    });
  });
});
// ==================================================================
// POST crear usuario FINAL
// ==================================================================

module.exports = app;
