const axios = require('axios');
const dotenv = require('dotenv');
const logger = require('../utils/logger/logger');

dotenv.config();

async function getNumberOfPages(year) {
  try {
    const url = 'https://api.themoviedb.org/3/discover/movie';
    const response = await axios.get(url, {
      params: {
        primary_release_year: year,
      },
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
      },
    });
    const data = await response.data;
    return data.total_pages;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = getNumberOfPages;
