const movieServices = require('./movie.services');
const logger = require('../utils/logger/logger');

async function search(keyword) {
  try {
    const result = await movieServices.searchMovies(keyword);
    return result;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = search;