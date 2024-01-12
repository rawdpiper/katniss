const logger = require('./logger/logger');
const loggerFormat = require('./logger/logFormat');

async function eventListener(queue) {
  try {
    queue.on('active', (job) => {
      logger.info(
        loggerFormat.nonRequestLogFormat(
          'Queue -',
          `${job.data.movie_id} of year ${job.data.year} picked from queue`
        )
      );
    });

    queue.on('completed', (job) => {
      logger.info(
        loggerFormat.nonRequestLogFormat(
          'Queue -',
          `${job.data.movie_id} of year ${job.data.year} completed`
        )
      );
    });

    queue.on('failed', (job, error) => {
      logger.error(
        loggerFormat.nonRequestLogFormat(
          'Queue -',
          `${job.data.movie_id} of year ${job.data.year} failed`
        )
      );
      logger.error(error);
    });

    queue.on('stalled', (job) => {
      logger.error(
        loggerFormat.nonRequestLogFormat(
          'Queue -',
          `${job.data.movie_id} stalled`
        )
      );
    });

    queue.on('error', (error) => {
      logger.error(error);
    });
  } catch (error) {
    logger.error(error);
  }
}

module.exports = eventListener;
