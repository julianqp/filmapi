const { default: axios } = require('axios');
const config = require('../config/config');
const { bulkWrite } = require('../models/films');
const videogameModel = require('../models/films');
module.exports = {
  //Metodo para añadir las películas populares
  popular: async (req, res) => {
    const { status, data } = await axios.get(
      `${config.tmdbUrl}movie/popular?api_key=${config.tmdbKey}&language=es-ES`,
    );
    if (status === 200) {
      const allmovies = data.results.map(movie => {
        const datamovie = {
          updateOne: {
            filter: { id: movie.id },
            update: {
              $set: {
                title: movie.title,
                vote_average: movie.vote_average,
                poster: movie.poster_path,
                overview: movie.overview,
                release_date: movie.release_date,
              },
              $setOnInsert: {
                id: movie.id,
              },
            },
            upsert: true,
          },
        };
        return datamovie;
      });

      try {
        await videogameModel.bulkWrite(allmovies);
        res.json({
          status: 'success',
          message: 'Videogame added successfully!!!',
          data: allmovies,
        });
      } catch (error) {
        res.json({
          status: 'fail',
          message: error.message,
          data: allmovies,
        });
      }
    }
    res
      .json({
        status: 'fail',
        message: 'Conexion to api the movie db fail!!!',
        data: null,
      })
      .status(403);
  },
  //Metodo para obtener las películas
  getFilms: async (req, res) => {
    try {
      const films = await videogameModel.find({});
      res
        .json({
          status: 'OK',
          message: '',
          data: films,
        })
        .status(200);
    } catch (error) {
      res
        .json({
          status: 'KO',
          message: error.message,
          data: null,
        })
        .status(403);
    }
  },
};
