const movieServices = require('./movie.services');
const logger = require('../utils/logger/logger');

async function fetchDetailsService(content_id, content_type) {
  try {
    if (content_type === 'movie') {
      const result = await movieServices.getMovieDetails(content_id);
      return result;
    }
  } catch (error) {
    logger.error(error);
  }
}

module.exports = fetchDetailsService;