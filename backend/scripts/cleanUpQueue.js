const Queue = require('bull');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

const movieIdsQueue = new Queue(process.env.QUEUE_NAME, process.env.REDIS_URI, {
  limiter: { max: 1, duration: 60000 },
});

async function cleanUpQueue() {
  try {
    const jobs = await movieIdsQueue.getJobs([
      'waiting',
      'active',
      'delayed',
      'failed',
      'completed',
    ]);
    if (jobs.length > 0) {
      await movieIdsQueue.empty();
      logger.info(
        loggerFormat.nonRequestLogFormat('Queue -', 'Queue cleaned up')
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = cleanUpQueue;
