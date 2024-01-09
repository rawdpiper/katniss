const mongoose = require('mongoose');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

async function dropMovieCollection() {
  try {
    await mongoose.connection.dropCollection('movies');
    logger.info(
      loggerFormat.nonRequestLogFormat('Database -', 'Movies collection dropped')
    );
  } catch (error) {
    logger.error(error);
  }
}

module.exports = dropMovieCollection;
