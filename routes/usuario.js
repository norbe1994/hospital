// importaciones
const express = require('express');
const bcrypt = require('bcrypt');

// inicializar variables
const app = express();
const { verificarToken } = require('../middleware/auth');

// importar modelo
const Usuario = require('../models/usuario');

// ==================================================================
// GET todos los usuarios COMIENZO
// PÚBLICA
// ==================================================================
app.get('/', (req, res) => {
  const desde = Number.parseInt(req.query.desde) || 0;
  const porPagina = Number.parseInt(req.query.porPagina) || 5;

  Usuario.find({}, 'nombre email img role isGoogle')
    .skip(desde)
    .limit(porPagina)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando usuarios',
          errors: err
        });
      }

      Usuario.count({}, (err, conteto) => {
        return res.status(200).json({
          ok: true,
          usuarios,
          conteto
        });
      });
    });
});
// ==================================================================
// todos los usuarios FINAL
// ==================================================================

// ==================================================================
// POST crear usuario COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.post('/', (req, res) => {
  const { nombre, email, password, img, role } = req.body;

  const usuario = new Usuario({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    img,
    role
  });

  usuario.save((err, usuario) => {
    if (err) {
      return res.status(400).json({
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
// crear usuario FINAL
// ==================================================================

// ==================================================================
// PUT actualizar usuario COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.put('/:id', [verificarToken], (req, res) => {
  const id = req.params.id;
  const { nombre, email, rol } = req.body;
  const actualizaciones = {
    nombre,
    email,
    rol
  };

  Usuario.findByIdAndUpdate(id, actualizaciones, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `Usuario con id: ${id} no existe`
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario existosamente actualizado',
      usuario
    });
  });
});
// ==================================================================
// actualizar usuario FINAL
// ==================================================================

// ==================================================================
// DELETE borrar usuario COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.delete('/:id', [verificarToken], (req, res) => {
  const id = req.params.id;

  Usuario.findByIdAndDelete(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `No existe un usuario con id: ${id}`,
        errors: err
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario borrado exitosamente',
      usuario
    });
  });
});
// ==================================================================
// borrar usuario FINAL
// ==================================================================

module.exports = app;
