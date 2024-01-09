const discover = require('../utils/discover');
const { getNumOfMoviesForYear } = require('../services/movie.services');
const { getYearFieldFromHash } = require('../utils/redis');
const dotenv = require('dotenv');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

dotenv.config();

async function fetchMovieIDs(queue) {
  try {
    const startYear = process.env.START_YEAR;
    const endYear = process.env.END_YEAR;
    for (let i = startYear; i <= endYear; i++) {
      const numOfMovies = await getNumOfMoviesForYear(i);
      const numOfMoviesInHash = await getYearFieldFromHash(i);
      if (String(numOfMovies) === numOfMoviesInHash) {
        logger.info(
          loggerFormat.nonRequestLogFormat(
            'Year -',
            `Year ${i} already completed!`
          )
        );
        continue;
      }
      const moviesResults = await discover(i);
      for (let j = 0; j < moviesResults.length; j++) {
        await queue.add(
          {
            movie_id: moviesResults[j].id,
            year: i,
          },
          {
            deleteOnComplete: true,
          }
        );
        logger.info(
          loggerFormat.nonRequestLogFormat(
            'Queue -',
            `${moviesResults[j].id} of year ${i} added to queue`
          )
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = fetchMovieIDs;
