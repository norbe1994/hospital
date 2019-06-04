// importaciones
const mongoose = require('mongoose');

// inicializar variables
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'nombre es un campo requerido']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email es un campo requerido']
  },
  password: {
    type: String,
    required: [true, 'password es un campo requerido']
  },
  img: {
    type: String
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE'
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
