// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
//Definimos el esquema
const Schema = mongoose.Schema;
// Creamos el objeto del esquema con sus correspondientes campos
const Item = Schema({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['paid', 'refunded', 'pending', 'pending-refund'],
    required: true,
  },
  pendingRefund: {
    type: Boolean,
    default: false,
  },
});

const OrderSchema = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    default: null,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
  },
  observation: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'mercadopago', 'paypal', 'pending-refund'],
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  items: {
    type: [Item],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  iva: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'refunded', 'pending'],
    required: true,
    default: 'created',
  },
  pendingRefund: {
    type: Boolean,
    default: false,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

OrderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Order', OrderSchema);
