// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
//Definimos el esquema
const Schema = mongoose.Schema;
// Creamos el objeto del esquema con sus correspondientes campos

const StripeSchema = new Schema({
  pi: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'refunded', 'pending'],
    required: true,
    default: 'created',
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Stripe', StripeSchema);
