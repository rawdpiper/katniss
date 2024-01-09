const getMovieDetails = require('../utils/getMovieDetails');
const {
  saveMovieDetailsToDB,
  addMovieGenresToMovieDetails,
} = require('../utils/saveMovieDetailsToDB');
const { addMovieIDSet, checkMovieIDSet } = require('../utils/redis');
const eventListener = require('../utils/eventListener');

async function processMovieIdsQueue(queue) {
  try {
    queue.process(async (job, done) => {
      const movieDetails = await getMovieDetails(job.data.movie_id);

      const movieExists = await checkMovieIDSet(movieDetails.id);

      if (!movieExists) {
        await saveMovieDetailsToDB(movieDetails, job.data.year);
        await addMovieGenresToMovieDetails(
          movieDetails.id,
          movieDetails.genres
        );
        await addMovieIDSet(String(movieDetails.id));
      }
      done();
    });
    eventListener(queue);
  } catch (error) {
    console.log(error);
  }
}

module.exports = processMovieIdsQueue;
