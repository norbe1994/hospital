// importaciones
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

// declaración de variables
const app = express();

// modelos
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

app.use(fileUpload());

// ==================================================================
// POST upload de imagen COMIENZO
// PRIVADO(USER)
// ==================================================================
app.post('/:coleccion/:id', (req, res) => {
  const { coleccion, id } = req.params;
  const colecciones = ['hospitales', 'medicos', 'usuarios'];
  if (!colecciones.includes(coleccion)) {
    return res.status(400).json({
      ok: false,
      mensaje: `Primer parámetro enviado: ${coleccion} - Válidos: ${colecciones.join(
        ', '
      )}`
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Ningún archivo fue subido'
    });
  }

  const archivo = req.files.imagen;
  const textosEntrePuntos = archivo.name.split('.');
  const extension = textosEntrePuntos[textosEntrePuntos.length - 1];
  const TIPOS_PERMITIDOS = ['png', 'jpg', 'gif', 'jpeg'];
  if (!TIPOS_PERMITIDOS.includes(extension)) {
    return res.status(406).json({
      ok: false,
      mensaje: `Tipo de archivo enviado: ${extension}
      Permitidos: ${TIPOS_PERMITIDOS.join(', ')}`
    });
  }

  const imagenId = `${id}-${new Date().getMilliseconds()}.${extension}`;
  const pathLocal = `uploads/${coleccion}/${imagenId}`;

  archivo.mv(pathLocal, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error de servidor al intentar subir la imagen',
        errors: err
      });
    }
  });
  actualizarImagenPorColeccion(coleccion, id, imagenId, res);
});
// ==================================================================
// upload de imagen FINAL
// ==================================================================

// ==================================================================
// actualizarImagenPorColeccion COMIENZO
// BUG: actualmente el unLinkSync no correrá si la función recibe un id no existente:
// siginifica que la imagen subida justo previo a a llamada de esta función (la última línea dentro del post('/:coleccion/:id'))
// será subida sin que la imagen del supuesto item(hospital, usuario, medico) que se trató de encontrar, no será removida,
// dejando una imagen bastarda en la carptea uploads/colección
// ==================================================================
function actualizarImagenPorColeccion(coleccion, id, imagenId, res) {
  switch (coleccion) {
    case 'usuarios':
      Usuario.findById(id, (err, usuario) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: `Error de servidor al buscar usuario con id: ${id}`,
            errors: err
          });
        }

        const pathViejo = `./uploads/usuarios/${usuario.img}`;

        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);

        usuario.img = imagenId;

        usuario.save((err, usuario) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error de servidor al intentar actulizar usuario',
              errors: err
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: 'Usuario actualizado',
            imagenId
          });
        });
      });
      break;
    case 'medicos':
      Medico.findById(id, (err, medico) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: `Error de servidor al buscar medico con id: ${id}`,
            errors: err
          });
        }

        const pathViejo = `./uploads/medicos/${medico.img}`;

        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);

        medico.img = imagenId;

        medico.save((err, medico) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error de servidor al intentar actulizar medico',
              errors: err
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: 'Medico actualizado',
            imagenId
          });
        });
      });
      break;
    case 'hospitales':
      Hospital.findById(id, (err, hospital) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: `Error de servidor al buscar hospital con id: ${id}`,
            errors: err
          });
        }

        const pathViejo = `./uploads/hospitales/${hospital.img}`;

        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);

        hospital.img = imagenId;

        hospital.save((err, hospital) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error de servidor al intentar actulizar hospital',
              errors: err
            });
          }
          return res.status(200).json({
            ok: true,
            mensaje: 'Hospital actualizado',
            imagenId
          });
        });
      });
      break;
  }
}
// ==================================================================
// actualizarImagenPorColeccion FINAL
// ==================================================================

module.exports = app;
