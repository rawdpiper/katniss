const movieModel = require('../models/movie.model');

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
    console.log(error);
  }
}


async function getNumOfMoviesForYear(year) {
  try {
    const numOfMovies = await movieModel.countDocuments({ year: year });
    return numOfMovies;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createMovieDetails,
  updateMovieGenre,
  getNumOfMoviesForYear,
};
