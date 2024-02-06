const express = require('express');
const app = express();
const cors = require('cors');
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

const searchRoute = require('./routes/search.route');
const fetchContentDetailsRoute = require('./routes/fetchContentDetails.route');

const movieIdsQueue = new Queue(process.env.QUEUE_NAME, process.env.REDIS_URI);

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

    app.use(cors());
    app.use(express.json());

    app.use('/ui', serverAdapter.getRouter());
    app.use('/api', searchRoute);
    app.use('/api', fetchContentDetailsRoute);

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
    
    await processMovieIDs(movieIdsQueue);
    await fetchMovieIDs(movieIdsQueue);
  } catch (error) {
    logger.error(error);
  }
}

main();
