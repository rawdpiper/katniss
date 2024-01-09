const axios = require('axios');
const dotenv = require('dotenv');
const { addYearToHash } = require('../utils/redis');
const getNumberOfPages = require('./getNumberOfPages');
const logger = require('../utils/logger/logger');

dotenv.config();

async function discover(year) {
  try {
    const url = 'https://api.themoviedb.org/3/discover/movie';

    const totalPages = await getNumberOfPages(year);

    const movieDetails = [];

    for (let i = 1; i <= totalPages; i++) {
      const response = await axios.get(url, {
        params: {
          primary_release_year: year,
          page: i,
        },
        headers: {
          Authorization: `Bearer ${  process.env.TMDB_API_READ_ACCESS_TOKEN}`,
        },
      });
      await addYearToHash(year, response.data.total_results);
      for (let j = 0; j < response.data.results.length; j++) {
        movieDetails.push(response.data.results[j]);
      }
    }
    return movieDetails;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = discover;
