const Redis = require('ioredis');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

const redis = new Redis(process.env.REDIS_URI);

async function deleteQueue() {
  try {
    await redis.del(`bull:${  process.env.QUEUE_NAME}`);
    logger.info(
      loggerFormat.nonRequestLogFormat('Queue -', 'Movies ID Queue deleted')
    );
  } catch (error) {
    console.log(error);
  }
}

async function addMovieIDSet(movie_id) {
  try {
    await redis.sadd('movie_ids', String(movie_id));
    logger.info(
      loggerFormat.nonRequestLogFormat('Set -', `Movie ID ${movie_id} added to Movies ID set`)
    );
  } catch (error) {
    console.log(error);
  }
}

async function checkMovieIDSet(movie_id) {
  try {
    const result = await redis.sismember('movie_ids', String(movie_id));
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function deleteMovieIdSet() {
  try {
    await redis.del('movie_ids');
    logger.info(
      loggerFormat.nonRequestLogFormat('Set -', 'Movies ID set deleted')
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  deleteQueue,
  addMovieIDSet,
  checkMovieIDSet,
  deleteMovieIdSet,
};
