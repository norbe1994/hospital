// importaciones
const jwt = require('jsonwebtoken');

// decalración de variables
const { SEED } = require('../config/config');

// ==================================================================
// middleware para verificar token COMIENZO
// ==================================================================
const verificarToken = (req, res, next) => {
  token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'token incorrecto',
        errors: err
      });
    }
    next();
  });
};
// ==================================================================
// middleware para verificar token FINAL
// ==================================================================

// exportaciones
module.exports.verificarToken = verificarToken;
