const Queue = require('bull');
const getMovieDetails = require('../utils/getMovieDetails');
const {
  saveMovieDetailsToDB,
  addMovieGenresToMovieDetails,
} = require('../utils/saveMovieDetailsToDB');
const { addMovieIDSet, checkMovieIDSet } = require('../utils/redis');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

const movieIdsQueue = new Queue(process.env.QUEUE_NAME, process.env.REDIS_URI, {
  limiter: { max: 1, duration: 60000 },
});

async function processMovieIdsQueue() {
  try {
    movieIdsQueue.process(async (job, done) => {
      logger.info(
        loggerFormat.nonRequestLogFormat('Queue -', `${job.data.movie_id} of year ${job.data.year} picked from queue`)
      );
      const movieDetails = await getMovieDetails(job.data.movie_id);

      const movieExists = await checkMovieIDSet(movieDetails.id);

      if (!movieExists) {
        await saveMovieDetailsToDB(movieDetails);
        await addMovieGenresToMovieDetails(
          movieDetails.id,
          movieDetails.genres
        );
        await addMovieIDSet(String(movieDetails.id));
      }
      done();
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = processMovieIdsQueue;
