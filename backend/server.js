const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const Queue = require('bull');
const fetchMovieIDs = require('./jobs/fetchMovieIDs');
const processMovieIDs = require('./jobs/processMovieIDs');
const connectDB = require('./db/db');
const { deleteQueue, deleteMovieIdSet } = require('./utils/redis');
const dropMovieCollection = require('./scripts/cleanUpDB');
const logger = require('./utils/logger/logger');

dotenv.config();

async function main() {
  await connectDB();

  if (process.env.NODE_ENV === 'dev') {
    await deleteQueue();
    await deleteMovieIdSet();
    await dropMovieCollection();
  }

  await fetchMovieIDs();
  await processMovieIDs();

  const movieIdsQueue = new Queue(
    process.env.QUEUE_NAME,
    process.env.REDIS_URI
  );

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/ui');

  createBullBoard({
    queues: [new BullMQAdapter(movieIdsQueue)],
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
}

main();
