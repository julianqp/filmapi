// Cargamos el módulo de mongoose
const mongoose = require('mongoose');
//Definimos el esquema
const Schema = mongoose.Schema;
// Creamos el objeto del esquema con sus correspondientes campos
const FilmSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  poster: {
    type: String,
    trim: true,
    required: true,
    default: null,
  },
  overview: {
    type: String,
    trim: true,
    required: true,
    default: '',
  },
  vote_average: {
    type: Number,
    default: 0,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 9,
  },
  release_date: {
    type: Date,
    trim: true,
    required: true,
  },
});
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Film', FilmSchema);
