const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('../utils/logger/logger');

dotenv.config();

async function deleteLogs() {
  try {
    const logPath = path.join(process.cwd(), process.env.LOG_PATH);
    const exists = fs.existsSync(logPath);
    if (exists) {
      fs.rmdirSync(logPath, { recursive: true });
      logger.info('Logs deleted');
    }
  } catch (error) {
    logger.error(error);
  }
}

module.exports = deleteLogs;
