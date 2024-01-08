const discover = require('../utils/discover');
const Queue = require('bull');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

const movieIdsQueue = new Queue(process.env.QUEUE_NAME, process.env.REDIS_URI, {
  limiter: { max: 1, duration: 60000 },
});

async function fetchMovieIDs() {
  try {
    for (let i = 1887; i < 1889; i++) {
      const moviesResults = await discover(i);
      for (let j = 0; j < moviesResults.length; j++) {
        await movieIdsQueue.add(
          {
            movie_id: moviesResults[j].id,
            year: i,
          },
          {
            deleteOnComplete: true,
          }
        );
        logger.info(
          loggerFormat.nonRequestLogFormat('Queue -', `${moviesResults[j].id} of year ${i} added to queue`)
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = fetchMovieIDs;
