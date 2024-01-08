const movie = require('../models/movie.model');

async function createMovieDetails(payload) {
  const newMovie = movie.create(payload);
  return newMovie;
}

async function updateMovieGenre(payload) {
  try {
    const updatedMovie = await movie.findOneAndUpdate(
      { movie_id: payload.movie_id },
      { $push: { genres: payload.genre.name } }
    );
    return updatedMovie;
  } catch (error) {
    console.log(error);
  }
}

async function getMovieDetails(movie_id) {
  try {
    const movieDetails = await getMovieDetails(movie_id);
    return movieDetails;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createMovieDetails,
  updateMovieGenre,
  getMovieDetails,
};
