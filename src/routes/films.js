const express = require('express');
const router = express.Router();

const filmsController = require('../controllers/films');

router.post('/', filmsController.popular);
router.get('/', filmsController.getFilms);

module.exports = router;
