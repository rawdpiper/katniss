const movieModel = require('../models/movie.model');
const logger = require('../utils/logger/logger');

async function createMovieDetails(payload) {
  const newMovie = movieModel.create(payload);
  return newMovie;
}

async function updateMovieGenre(payload) {
  try {
    const updatedMovie = await movieModel.findOneAndUpdate(
      { movie_id: payload.movie_id },
      { $push: { genres: payload.genre.name } }
    );
    return updatedMovie;
  } catch (error) {
    logger.error(error);
  }
}

async function getNumOfMoviesForYear(year) {
  try {
    const numOfMovies = await movieModel.countDocuments({ year: year });
    return numOfMovies;
  } catch (error) {
    logger.error(error);
  }
}

async function searchMovies(keyword) {
  try {
    const movies = await movieModel.find(
      {
        title: { $regex: keyword, $options: 'i' },
      },
      'movie_id title year runtime, poster_path content_type'
    );
    return movies;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  createMovieDetails,
  updateMovieGenre,
  getNumOfMoviesForYear,
  searchMovies,
};
