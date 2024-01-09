const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const Queue = require('bull');
const fetchMovieIDs = require('./jobs/fetchMovieIDs');
const processMovieIDs = require('./jobs/processMovieIDs');
const connectDB = require('./db/db');
const { deleteMovieIdSet, deleteYearHash } = require('./utils/redis');
const dropMovieCollection = require('./scripts/cleanUpDB');
const emptyQueue = require('./scripts/cleanUpQueue');
const logger = require('./utils/logger/logger');

const movieIdsQueue = new Queue(process.env.QUEUE_NAME, process.env.REDIS_URI, {
  limiter: { max: 1, duration: 60000 },
});

dotenv.config();

async function main() {
  try {
    await connectDB();

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/ui');

    createBullBoard({
      queues: [new BullAdapter(movieIdsQueue)],
      serverAdapter,
    });

    app.use(express.json());
    app.use('/ui', serverAdapter.getRouter());
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      logger.info(`
      ###########################################
      Server is currently running at port ${PORT}
      ###########################################`);
    });

    if (process.env.NODE_ENV === 'dev') {
      await emptyQueue();
      await deleteMovieIdSet();
      await dropMovieCollection();
      await deleteYearHash();
    }

    await fetchMovieIDs(movieIdsQueue);
    await processMovieIDs(movieIdsQueue);
  } catch (error) {
    logger.error(error);
  }
}

main();
