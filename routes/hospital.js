// importaciones
const express = require('express');

// inicializar variables
const app = express();
const { verificarToken } = require('../middleware/auth');

// importar modelo
const Hospital = require('../models/hospital');

// ==================================================================
// GET todos los hospitales COMIENZO
// PÚBLICO
// ==================================================================
app.get('/', (req, res) => {
  Hospital.find({}, (err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al cargar hospitales',
        errors: err
      });
    }

    return res.status(200).json({
      ok: true,
      hospitales
    });
  });
});
// ==================================================================
// todos los hospitales FINAL
// ==================================================================

// ==================================================================
// POST crear un hospital COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.post('/', [verificarToken], (req, res) => {
  const { nombre, img, usuario } = req.body;

  const hospital = new Hospital({
    nombre,
    img,
    usuario
  });

  hospital.save((err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al crear hospital',
        errors: err
      });
    }

    return res.status(200).json({
      ok: true,
      hospital
    });
  });
});
// ==================================================================
// crear un hospital FINAL
// ==================================================================

// ==================================================================
// PUT editar hospital COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.put('/:id', [verificarToken], (req, res) => {
  const id = req.params.id;

  const { nombre, img, usuario } = req.body;

  const actualizaciones = {
    nombre,
    img,
    usuario
  };

  Hospital.findByIdAndUpdate(id, actualizaciones, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al intentar editar hospital',
        errors: err
      });
    }

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        mensaje: `No existe hospital con id: ${id}`
      });
    }

    return res.status(200).json({
      ok: true,
      hospital
    });
  });
});
// ==================================================================
// editar hospital FINAL
// ==================================================================

// ==================================================================
// DELETE borrar hospital COMIENZO
// PRIVADO(ADMIN)
// ==================================================================
app.delete('/:id', [verificarToken], (req, res) => {
  const id = req.params.id;

  Hospital.findByIdAndDelete(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al intertar de borrar hospital',
        errors: err
      });
    }

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        mensaje: `Hospital con id: ${id} no encontrado`
      });
    }

    return res.status(200).json({
      ok: false,
      hospital
    });
  });
});
// ==================================================================
// borrar hospital FINAL
// ==================================================================

module.exports = app;
