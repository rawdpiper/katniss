const movieService = require('../services/movie.services');
const logger = require('../utils/logger/logger');

async function saveMovieDetailsToDB(details, year) {
  try {
    const movieDetails = await movieService.createMovieDetails({
      movie_id: details.id,
      title: details.title,
      overview: details.overview,
      tagline: details.tagline,
      status: details.status,
      runtime: details.runtime,
      release_date: details.release_date,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      imdb_id: details.imdb_id,
      year: year,
    });
    return movieDetails;
  } catch (error) {
    logger.error(error);
  }
}

async function addMovieGenresToMovieDetails(movie_id, genres) {
  try {
    for (let i = 0; i < genres.length; i++) {
      const genre = genres[i];
      await movieService.updateMovieGenre({
        movie_id,
        genre,
      });
    }
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  saveMovieDetailsToDB,
  addMovieGenresToMovieDetails,
};
