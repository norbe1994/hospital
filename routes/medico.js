// importaciones
const express = require('express');

// declaración de variable
const app = express();
const { verificarToken } = require('../middleware/auth');

// cargar modelo
const Medico = require('../models/medico');

// ==================================================================
// GET todos los médicos COMIENZO
// PÚBLICO(ADMIN)
// ==================================================================
app.get('/', (req, res) => {
  const desde = req.query.desde || 0;
  const porPagina = req.query.porPagina || 5;

  Medico.find({})
    .skip(desde)
    .limit(porPagina)
    .populate('usuario', 'nombre email')
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al cargar medicos',
          errors: err
        });
      }

      Medico.find({}, (err, conteo) => {
        return res.status(200).json({
          ok: true,
          medicos,
          conteo
        });
      });
    });
});
// ==================================================================
// todos los médicos FINAL
// ==================================================================

// ==================================================================
// POST crear un médico COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.post('/', [verificarToken], (req, res) => {
  const { nombre, img, usuario, hospital } = req.body;

  const medico = new Medico({
    nombre,
    img,
    usuario,
    hospital
  });

  medico.save((err, medico) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al guardar médico',
        errors: err
      });
    }

    return res.status(201).json({
      ok: true,
      medico
    });
  });
});
// ==================================================================
// crear un médico FINAL
// ==================================================================

// ==================================================================
// PUT actualizar médico COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.put('/:id', [verificarToken], (req, res) => {
  const id = req.params.id;

  const { nombre, img, usuario, hospital } = req.body;

  const actualizaciones = {
    nombre,
    img,
    usuario,
    hospital
  };

  Medico.findByIdAndUpdate(id, actualizaciones, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al editar médico',
        errors: err
      });
    }

    if (!medico) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      ok: true,
      medico
    });
  });
});
// ==================================================================
// actualizar médico FINAL
// ==================================================================

// ==================================================================
// DELETE borrar médico COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.delete('/:id', [verificarToken], (req, res) => {
  const id = req.params.id;

  Medico.findByIdAndDelete(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error de servidor al intentar borrar usuario'
      });
    }

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `Usuario con id: ${id} no encontrado`
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario exitosamente borrado',
      usuario
    });
  });
});
// ==================================================================
// borrar médico FINAL
// ==================================================================

module.exports = app;
