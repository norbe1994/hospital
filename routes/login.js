// importaciones
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// inicializar variables
const app = express();
const SEED = require('../config/config').SEED;
const { CLIENT_ID } = require('../config/config');
const client = new OAuth2Client(CLIENT_ID);

// inicializar modelo/s
const Usuario = require('../models/usuario');

// ==================================================================
// POST login normal (email y contraseña) COMIENZO
// PÚBLICO
// ==================================================================
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
// ==================================================================
// login normal FINAL
// ==================================================================

// ==================================================================
// POST google login COMIENZO
// PÚBLICO
// ==================================================================
app.post('/google', async (req, res) => {
  const { token } = req.body;

  const googleUser = await verificarGoogleToken(token).catch(err => {
    return res.status(400).json({
      ok: false,
      mensaje: `Token: ${token} inválido`,
      errors: err
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: `Error al buscar usuario con email: ${email}`,
        errors: err
      });
    }

    if (usuario) {
      if (!usuario.isGoogle) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Debe autenticarse con su email y contraseña',
          errors: err
        });
      } else {
        const token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 });

        return res.status(200).json({
          ok: true,
          usuario,
          token
        });
      }
    } else {
      const { nombre, email, isGoogle, img } = googleUser;

      const usuario = new Usuario({
        nombre,
        email,
        isGoogle,
        img,
        password: 'placeholder'
      });

      usuario.save((err, usuario) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error de servidor al guardar usuario',
            errors: err
          });
        }

        const token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 });

        return res.status(200).json({
          ok: true,
          usuario,
          token
        });
      });
    }
  });
});
// ==================================================================
// google login FINAL
// ==================================================================

// ==================================================================
// función para validar y decifrar el token COMIENZO
// ==================================================================
async function verificarGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    isGoogle: true
  };
}
// ==================================================================
// función para validar y decifrar el token FINAL
// ==================================================================

module.exports = app;
