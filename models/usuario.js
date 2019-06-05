// importaciones
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// inicializar variables
const Schema = mongoose.Schema;

// definir roles
const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol permitido'
};

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
    default: 'USER_ROLE',
    enum: rolesValidos
  }
});

usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe ser único pero ya esta en uso'
});

module.exports = mongoose.model('Usuario', usuarioSchema);
