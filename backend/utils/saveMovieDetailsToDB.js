const movieService = require('../services/movie.services');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

async function saveMovieDetailsToDB(details) {
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
    });
    logger.info(
      loggerFormat.nonRequestLogFormat('Database -', `${details.id}: '${details.title}' saved to database`)
    );
    return movieDetails;
  } catch (error) {
    console.log(error);
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
    logger.info(
      loggerFormat.nonRequestLogFormat('Database -', `${movie_id} genre updated`)
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  saveMovieDetailsToDB,
  addMovieGenresToMovieDetails,
};
