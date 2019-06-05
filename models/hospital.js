// importaciones
const mongoose = require('mongoose');

// inicializar variables
const Schema = mongoose.Schema;

const hospitalSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'nombre es un campo requerido'] },
    img: { type: String },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'usuario es un campo requerido']
    }
  },
  { collection: 'hospitales' }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
