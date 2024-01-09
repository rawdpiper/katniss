const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../utils/logger/logger');
const loggerFormat = require('../utils/logger/logFormat');

dotenv.config();

const db = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_DATABASE_NAME}.dmfnf6m.mongodb.net/`;

async function connectDB() {
  try {
    await mongoose.connect(db);
    logger.info(
      loggerFormat.nonRequestLogFormat('Database -', 'MongoDB connected')
    );
  } catch (error) {
    logger.error(error);
  }
}

module.exports = connectDB;
