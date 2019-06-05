// importaciones
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// inicializar variables
const app = express();
const SEED = require('../config/config').SEED;

// inicializar modelo/s
const Usuario = require('../models/usuario');

app.post('/', (req, res) => {
  const { email, password } = req.body;

  Usuario.findOne({ email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al cargar usuario',
        errors: err
      });
    }

    if (!usuario) {
      return res.status(404).json({
        ok: true,
        mensaje: `No existe usuario con el email: ${email}`
        // ^ mensaje de etapa de desarrollo, en producción no debe específicar la razón de la falla de autenticación
      });
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      return res.status(403).json({
        ok: false,
        mensaje: `Usuario encontrado pero la contraseña: ${password} no es correcta`
        // ^ mensaje de etapa de desarrollo, en producción no debe específicar la razón de la falla de autenticación
      });
    }

    const token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 });

    res.status(200).json({
      ok: true,
      usuario,
      token
    });
  });
});

module.exports = app;
