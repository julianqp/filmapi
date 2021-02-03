const express = require('express');
const logger = require('morgan');
const films = require('./routes/films');
const orders = require('./routes/orders');
const payment = require('./routes/payment');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('./config/db');
const app = express();

mongoose.connection.on(
  'error',
  console.error.bind(console, 'Error de conexion en MongoDB'),
);
app.use(express.static('.'));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.json({ tutorial: 'Construyendo una API REST con NodeJS' });
});

app.use('/orders', orders);
app.use('/films', films);
app.use('/payment', payment);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  console.log(err);

  if (err.status === 404) res.status(404).json({ message: 'Not found' });
  else res.status(500).json({ message: 'Error interno en el servidor!!' });
});

app.listen(3004, function () {
  console.log('El servidor ha sido inicializado: http://localhost:3004');
});
