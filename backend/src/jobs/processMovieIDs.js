const getMovieDetails = require('../utils/getMovieDetails');
const {
  saveMovieDetailsToDB,
  addMovieGenresToMovieDetails,
} = require('../utils/saveMovieDetailsToDB');
const { addMovieIDSet, checkMovieIDSet } = require('../utils/redis');
const eventListener = require('../utils/eventListener');
const logger = require('../utils/logger/logger');

async function processMovieIdsQueue(queue) {
  try {
    queue.process(async (job, done) => {
      try {
        const movieDetails = await getMovieDetails(job.data.movie_id);
        if (!movieDetails || !movieDetails.id) {
          job.moveToFailed(true);
        }

        const movieExists = await checkMovieIDSet(movieDetails.id);

        if (!movieExists) {
          await saveMovieDetailsToDB(movieDetails, job.data.year);
          await addMovieGenresToMovieDetails(
            movieDetails.id,
            movieDetails.genres
          );
          await addMovieIDSet(String(movieDetails.id));
        }
        done();
      } catch (innerError) {
        logger.error(`Error processing job ${job.id}: ${innerError.message}`);
        job.moveToFailed({ message: innerError.message }, true);
        done(innerError);
      }
    });
    eventListener(queue);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = processMovieIdsQueue;
