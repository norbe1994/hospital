// importaciones
const mongoose = require('mongoose');

// inicializar variables
const Schema = mongoose.Schema;

const medicoSchema = new Schema({
  nombre: { type: String, required: [true, 'nombre es un campo requerido'] },
  img: { type: String },
  usuario: {
    type: Schema.Types.ObjectId,
    required: [true, 'usuario es un campo requerido']
  },
  hospital: {
    type: Schema.Types.ObjectId,
    required: [true, 'hospital es un campo requerido']
  }
});

module.exports = mongoose.model('Medico', medicoSchema);
