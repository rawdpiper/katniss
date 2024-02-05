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
    const initial_response = await axios.get(url, {
      params: {
        primary_release_year: year,
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
      },
    });
    const movieDetails = [];
    const numOfMovies = initial_response.data.total_results;
    await addYearToHash(year, numOfMovies);
    if (numOfMovies > 10000) {
      const quaterly_array = [];
      const string_year = year.toString();
      quaterly_array.push([`${string_year}-01-01`, `${string_year}-03-31`]);
      quaterly_array.push([`${string_year}-04-01`, `${string_year}-06-30`]);
      quaterly_array.push([`${string_year}-07-01`, `${string_year}-09-30`]);
      quaterly_array.push([`${string_year}-10-01`, `${string_year}-12-31`]);
      for (let i = 0; i < quaterly_array.length; i++) {
        const response = await axios.get(url, {
          params: {
            page: 1,
            'primary_release_date.gte': quaterly_array[i][0],
            'primary_release_date.lte': quaterly_array[i][1],
          },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
          },
        });
        const quater_total_pages = response.data.total_pages;
        for (let j = 1; j <= quater_total_pages; j++) {
          const response = await axios.get(url, {
            params: {
              page: j,
              'primary_release_date.gte': quaterly_array[i][0],
              'primary_release_date.lte': quaterly_array[i][1],
            },
            headers: {
              Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
            },
          });
          for (let k = 0; k < response.data.results.length; k++) {
            movieDetails.push(response.data.results[k]);
          }
        }
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        const response = await axios.get(url, {
          params: {
            primary_release_year: year,
            page: i,
          },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
          },
        });
        for (let j = 0; j < response.data.results.length; j++) {
          movieDetails.push(response.data.results[j]);
        }
      }
    }

    return movieDetails;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = discover;
